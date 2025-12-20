export interface CliArgs {
  file: string;
  port: number;
  watch: boolean;
  // Future: watch?: boolean; format?: 'json' | 'yaml' | etc.
}

export type Resource =
  | { type: 'singleton'; name: string; value: any }
  | { type: 'collection'; name: string; items: any[] };

export type ResourceMap = Map<string, Resource>;
