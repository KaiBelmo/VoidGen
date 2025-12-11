import { Request, Response } from 'express';
import { isStructuralMatch, assignExistingKeys } from '../../utils/objectUtils';

export const getCollection = (items: any[]) => (_: Request, res: Response) => {
  res.json(items);
};

export const getCollectionItem = (items: any[]) => (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const item = items.find((i) => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
};

export const postCollection = (items: any[]) => (req: Request, res: Response) => {
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
  res.status(201).json(req.body);
};

export const putCollectionItem = (items: any[]) => (req: Request, res: Response) => {
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
  res.json(items[index]);
};

export const patchCollectionItem = (items: any[]) => (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  assignExistingKeys(items[index], req.body);
  res.json(items[index]);
};

export const deleteCollectionItem = (items: any[]) => (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  items.splice(index, 1);
  res.status(204).send();
};
