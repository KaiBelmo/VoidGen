import { Request, Response } from 'express';
import { isStructuralMatch, assignExistingKeys } from '../../utils/objectUtils';
import { Store } from 'src/datastore/dataStore';

export const getCollection = (state: Store, name: string) => (_: Request, res: Response) => {
  const items = state.get()[name];
  res.json(items);
};

export const getCollectionItem = (state: Store, name: string) => (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const items: Array<any> = state.get()[name];
  const item = items.find((i) => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
};

export const postCollection = (state: Store, name: string) => (req: Request, res: Response) => {
  const currentState = state.get();
  const items: Array<any> = currentState[name];

  if (items.length > 0 && !isStructuralMatch(items[0], req.body)) {
    return res.status(400).json({
      rejected: 'Invalid payload: keys do not match resource schema',
    });
  }

  // Auto-generate an ID if missing
  if (req.body.id == null) {
    req.body.id = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  }

  items.push(req.body);
  state.set({
    ...currentState,
    [name]: items,
  });

  res.status(201).json(req.body);
};

export const putCollectionItem = (state: Store, name: string) => (req: Request, res: Response) => {
  const currentState = state.get();
  const items: Array<any> = currentState[name];

  const id = Number(req.params.id);
  const index = items.findIndex((i) => i.id === id);

  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  if (!isStructuralMatch(items[index], req.body)) {
    return res.status(400).json({
      rejected: 'Invalid payload: keys do not match resource schema',
    });
  }

  req.body.id = id;

  items[index] = req.body;
  state.set({
    ...currentState,
    [name]: items,
  });

  res.status(201).json(items[index]);
};

export const patchCollectionItem = (state: Store, name: string) => (req: Request, res: Response) => {
  const currentState = state.get();
  const items: Array<any> = currentState[name];

  const id = Number(req.params.id);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  assignExistingKeys(items[index], req.body);
  state.set({
    ...currentState,
    [name]: items,
  });

  res.status(201).json(req.body);
};

export const deleteCollectionItem = (state: Store, name: string) => (req: Request, res: Response) => {
  const currentState = state.get();
  const items: Array<any> = currentState[name];

  const id = Number(req.params.id);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  items.splice(index, 1);

  state.set({
    ...currentState,
    [name]: items,
  });

  res.status(204).send();
};
