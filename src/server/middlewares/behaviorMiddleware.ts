import { Request, Response, NextFunction, RequestHandler } from 'express';
import { MethodBehaviorMap } from '@/types/map';
import { ValidationConfig, ErrorInjectionConfig, RateLimitConfig } from '@/types/behavior';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitStores = new Map<string, RateLimitStore>();

export const clearRateLimitStores = (): void => {
  rateLimitStores.clear();
};

export const createBehaviorMiddleware = (behaviorMap: MethodBehaviorMap | null): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!behaviorMap) {
      return next();
    }

    const method = req.method.toUpperCase();
    const methodBehavior = behaviorMap.get(method);

    if (!methodBehavior) {
      return next();
    }

    // Apply delay
    if (typeof methodBehavior.delay === 'number' && methodBehavior.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, methodBehavior.delay));
    }

    // Apply error injection
    if (methodBehavior.errorInjection?.enabled) {
      const errorConfig: ErrorInjectionConfig = methodBehavior.errorInjection;
      const probability = errorConfig.probability ?? 1; // Default to always error if enabled

      if (Math.random() < probability) {
        const statusCode = errorConfig.statusCode ?? 500;
        const message = errorConfig.message ?? 'Internal Server Error';
        return res.status(statusCode).json({ error: message });
      }
    }

    // Apply rate limiting
    if (methodBehavior.rateLimit) {
      const rateLimitConfig: RateLimitConfig = methodBehavior.rateLimit;
      const key = `${req.method}:${req.ip}:${req.path}`;
      const now = Date.now();

      let store = rateLimitStores.get(key);

      if (!store || now > store.resetTime) {
        store = { count: 1, resetTime: now + rateLimitConfig.windowMs };
        rateLimitStores.set(key, store);
      } else {
        store.count++;
      }

      if (store.count > rateLimitConfig.maxRequests) {
        const statusCode = rateLimitConfig.statusCode ?? 429;
        const message = rateLimitConfig.message ?? 'Too Many Requests';
        return res.status(statusCode).json({ error: message });
      }
    }

    // Apply validation
    if (methodBehavior.validation && ['POST', 'PUT', 'PATCH'].includes(method)) {
      const validationConfig: ValidationConfig = methodBehavior.validation;
      const body = req.body;

      if (validationConfig.requiredFields && body) {
        const missingFields = validationConfig.requiredFields.filter((field: string) => !(field in body));

        if (missingFields.length > 0) {
          const statusCode = validationConfig.errorStatus ?? 400;
          return res.status(statusCode).json({
            error: 'Missing required fields',
            missingFields,
          });
        }
      }
    }

    next();
  };
};
