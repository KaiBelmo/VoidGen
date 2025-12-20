import { Request, Response } from 'express';
import { isStructuralMatch, assignExistingKeys } from '../../utils/objectUtils';

import { Store } from 'src/datastore/dataStore';

export const getSingleton = (state: Store, name: string) => (_: Request, res: Response) => {
  res.json(state.get()[name]);
};

export const putSingleton = (state: Store, name: string) => (req: Request, res: Response) => {
  const currentState = state.get();
  if (!isStructuralMatch(currentState[name], req.body)) {
    return res.status(400).json({
      rejected: 'Invalid payload: keys do not match resource schema',
    });
  }
  const newData = {
    ...currentState,
    [name]: req.body,
  };
  state.set(newData);
  return res.status(200).json({ received: req.body });
};

export const patchSingleton = (state: Store, name: string) => (req: Request, res: Response) => {
  const data = state.get();

  assignExistingKeys(data[name], req.body);
  state.set(data);
  res.status(200).json({ received: data[name] });
};
