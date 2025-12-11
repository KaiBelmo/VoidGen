import express, { Express, Request, Response, NextFunction } from 'express';
import { DataSource } from '../datasource/DataSource';
import type { ResourceMap } from '../types';
import * as singletonHandlers from './handlers/singletonHandlers';
import * as collectionHandlers from './handlers/collectionHandlers';

export class Server {
  private app: Express;
  private data: any; // In-memory data store
  private resourceMap: ResourceMap;

  constructor(
    private dataSource: DataSource,
    private port: number,
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
    this.data = rawData;
    this.resourceMap = this.dataSource.parse(rawData);
    this.createRoutes();
  }

  private createRoutes() {
    for (const [, resource] of this.resourceMap) {
      const baseRoute = `/api/${resource.name}`;
      if (resource.type === 'singleton') {
        this.app.get(baseRoute, singletonHandlers.getSingleton(this.data, resource.name));
        this.app.put(baseRoute, singletonHandlers.putSingleton(this.data, resource.name));
        this.app.patch(baseRoute, singletonHandlers.patchSingleton(this.data, resource.name));
      } else if (resource.type === 'collection') {
        this.app.get(baseRoute, collectionHandlers.getCollection(resource.items));
        this.app.get(`${baseRoute}/:id`, collectionHandlers.getCollectionItem(resource.items));
        this.app.post(baseRoute, collectionHandlers.postCollection(resource.items));
        this.app.put(`${baseRoute}/:id`, collectionHandlers.putCollectionItem(resource.items));
        this.app.patch(`${baseRoute}/:id`, collectionHandlers.patchCollectionItem(resource.items));
        this.app.delete(
          `${baseRoute}/:id`,
          collectionHandlers.deleteCollectionItem(resource.items),
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
