import { Request, Response } from 'express';
import { isStructuralMatch, assignExistingKeys } from '../../utils/objectUtils';

export const getSingleton = (data: any, name: string) => (_: Request, res: Response) => {
  res.json(data[name]);
};

export const putSingleton = (data: any, name: string) => (req: Request, res: Response) => {
  if (!isStructuralMatch(data[name], req.body)) {
    return res.status(400).json({
      rejected: 'Invalid payload: keys do not match resource schema',
    });
  }
  data[name] = req.body;
  return res.status(200).json({ received: data[name] });
};

export const patchSingleton = (data: any, name: string) => (req: Request, res: Response) => {
  assignExistingKeys(data[name], req.body);
  res.status(200).json({ received: data[name] });
};
