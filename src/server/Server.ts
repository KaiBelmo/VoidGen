import express, { Express, Request, Response, NextFunction } from 'express';
import { watchFile } from '../utils/fileWatcher';
import { DataSource } from '../datasource/DataSource';
import type { MethodBehaviorMap, ResourceMap } from '../types';
import * as singletonHandlers from './handlers/singletonHandlers';
import * as collectionHandlers from './handlers/collectionHandlers';
import { BehaviorManager } from './route-behaviors/BehaviorManager';
import { Store } from '../datastore/dataStore';
import { requestLogger } from './middlewares/requestLogger';
import { createBehaviorMiddleware } from './middlewares/behaviorMiddleware';

export class Server {
  private app: Express;
  // private data: any; // In-memory data store
  private resourceMap!: ResourceMap;
  private behaviorManager: BehaviorManager;
  private state = new Store<any>();

  constructor(
    private dataSource: DataSource,
    private port: number,
    private fileName: string,
    private isWatchEnabled: boolean,
  ) {
    this.app = express();
    this.behaviorManager = new BehaviorManager(fileName);
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
    this.state.set(rawData);
    this.resourceMap = this.dataSource.parse(this.state.get());
    if (this.isWatchEnabled) this.watchFile();
    this.createRoutes();
  }

  private watchFile() {
    watchFile(this.fileName, 'data', () => {
      this.state.set(this.dataSource.load());
      this.resourceMap = this.dataSource.parse(this.state.get());
    });

    const behaviorConfigPath = this.behaviorManager.getConfigPath();
    if (behaviorConfigPath) {
      watchFile(behaviorConfigPath, 'behavior config', () => {
        this.behaviorManager.loadConfig();
      });
    }
  }

  // ResourceMap describes the API / Store owns the data
  private createRoutes() {
    for (const [, resource] of this.resourceMap) {
      const baseRoute = `/api/${resource.name}`;
      const routeBehavior: MethodBehaviorMap | null = this.behaviorManager.getRouteBehavior(baseRoute);

      const middlewares = [requestLogger(), createBehaviorMiddleware(routeBehavior)];

      this.app.use(baseRoute, ...middlewares);

      if (resource.type === 'singleton') {
        const singletonRouter = express.Router();

        singletonRouter.get('/', singletonHandlers.getSingleton(this.state, resource.name));
        singletonRouter.put('/', singletonHandlers.putSingleton(this.state, resource.name));
        singletonRouter.patch('/', singletonHandlers.patchSingleton(this.state, resource.name));
        this.app.use(baseRoute, singletonRouter);
      } else if (resource.type === 'collection') {
        const collectionRouter = express.Router();

        collectionRouter.get('/', collectionHandlers.getCollection(this.state, resource.name));
        collectionRouter.get('/:id', collectionHandlers.getCollectionItem(this.state, resource.name));
        collectionRouter.post('/', collectionHandlers.postCollection(this.state, resource.name));
        collectionRouter.put('/:id', collectionHandlers.putCollectionItem(this.state, resource.name));
        collectionRouter.patch('/:id', collectionHandlers.patchCollectionItem(this.state, resource.name));
        collectionRouter.delete('/:id', collectionHandlers.deleteCollectionItem(this.state, resource.name));
        this.app.use(baseRoute, collectionRouter);
      }
    }
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}
