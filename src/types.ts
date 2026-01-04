export interface CliArgs {
  file: string;
  port: number;
  watch: boolean;
  // Future: watch?: boolean; format?: 'json' | 'yaml' | etc.
}

export interface ValidationConfig {
  requiredFields?: string[];
  errorStatus?: number;
}

export interface BehaviorConfig {
  delay?: number;
  validation?: ValidationConfig;
}

export type BehaviorMap = Map<
  string, // route, e.g. "/api/users"
  Map<string, BehaviorConfig> // method, e.g. "POST"
>;

export type Resource =
  | { type: 'singleton'; name: string; value: any }
  | { type: 'collection'; name: string; items: any[] };

export type ResourceMap = Map<string, Resource>;

export type MethodBehaviorMap = ReadonlyMap<string, BehaviorConfig>;
