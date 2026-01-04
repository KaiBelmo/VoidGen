import { Request, Response, NextFunction, RequestHandler } from 'express';

export const requestLogger = (): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const format = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 19);

  console.log(`\n[${format(new Date())}] ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    const end = new Date();
    console.log(`[${format(end)}] ${req.method} ${req.originalUrl} - ${res.statusCode} [${end.getTime() - start}ms]`);
  });

  next();
};
