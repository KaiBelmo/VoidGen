export type Resource =
  | { type: 'singleton'; name: string; value: any }
  | { type: 'collection'; name: string; items: any[] };

export type ResourceMap = Map<string, Resource>;
