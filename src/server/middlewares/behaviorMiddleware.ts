import { Request, Response, NextFunction, RequestHandler } from 'express';
import { MethodBehaviorMap } from '../../types';

export const createBehaviorMiddleware = (behaviorMap: MethodBehaviorMap | null): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!behaviorMap) {
      return next();
    }
    const methodBehavior = behaviorMap.get(req.method);
    console.log('Method behavior:', methodBehavior);
    next();
  };
};
