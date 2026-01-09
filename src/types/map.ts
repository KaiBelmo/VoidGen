import { BehaviorConfig } from './behavior';

export type BehaviorMap = Map<
  string, // route, e.g. "/api/users"
  Map<string, BehaviorConfig> // method, e.g. "POST"
>;

export type MethodBehaviorMap = ReadonlyMap<string, BehaviorConfig>;
