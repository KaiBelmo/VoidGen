import express, { Express, Request, Response, NextFunction } from 'express';
import { DataSource } from '../datasource/DataSource';
import type { ResourceMap } from '../types';
import * as singletonHandlers from './handlers/singletonHandlers';
import * as collectionHandlers from './handlers/collectionHandlers';
import { watch, WatchEventType } from 'node:fs';
import { Store } from '../datastore/dataStore';

export class Server {
  private app: Express;
  // private data: any; // In-memory data store
  private resourceMap: ResourceMap;
  private state = new Store<any>();

  constructor(
    private dataSource: DataSource,
    private port: number,
    private fileName: string,
  ) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(this.errorHandler);
    this.initialize();
  }

  private errorHandler = (err: unknown, _: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in (err as any)) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next();
  };

  private initialize() {
    const rawData = this.dataSource.load();
    // this.data = rawData;
    this.state.set(rawData);
    this.resourceMap = this.dataSource.parse(this.state.get());
    this.watchFile();
    this.createRoutes();
  }

  private watchFile() {
    watch(this.fileName, (eventType: WatchEventType, filename) => {
      if (eventType === 'change') {
        console.log(`[${filename}]: data changed, reloading...`);
        // this.data = this.dataSource.load();
        this.state.set(this.dataSource.load());
        this.resourceMap = this.dataSource.parse(this.state.get());
        console.log(`[${filename}]: successfully reloaded.`);
      }
    });
  }

  // ResourceMap describes the API / Store owns the data
  private createRoutes() {
    for (const [, resource] of this.resourceMap) {
      const baseRoute = `/api/${resource.name}`;
      if (resource.type === 'singleton') {
        this.app.get(baseRoute, singletonHandlers.getSingleton(this.state, resource.name));
        this.app.put(baseRoute, singletonHandlers.putSingleton(this.state, resource.name));
        this.app.patch(baseRoute, singletonHandlers.patchSingleton(this.state, resource.name));
      } else if (resource.type === 'collection') {
        this.app.get(baseRoute, collectionHandlers.getCollection(this.state, resource.name));
        this.app.get(
          `${baseRoute}/:id`,
          collectionHandlers.getCollectionItem(this.state, resource.name),
        );
        this.app.post(baseRoute, collectionHandlers.postCollection(this.state, resource.name));
        this.app.put(
          `${baseRoute}/:id`,
          collectionHandlers.putCollectionItem(this.state, resource.name),
        );
        this.app.patch(
          `${baseRoute}/:id`,
          collectionHandlers.patchCollectionItem(this.state, resource.name),
        );
        this.app.delete(
          `${baseRoute}/:id`,
          collectionHandlers.deleteCollectionItem(this.state, resource.name),
        );
      }
    }
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}
