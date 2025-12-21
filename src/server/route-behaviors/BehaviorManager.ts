import { readFileSync } from 'fs';
import { BehaviorMap, BehaviorConfig } from 'src/types';

export class BehaviorManager {
  private behaviorMap: BehaviorMap = new Map();

  constructor(configPath: string) {
    this.loadConfig(configPath);
  }

  loadConfig(configPath: string) {
    const file = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(file);
    for (let [route, routeConfig] of Object.entries(config)) {
      const methodMap = new Map<string, BehaviorConfig>();
      if (routeConfig && typeof routeConfig === 'object') {
        for (let [method, behavior] of Object.entries(routeConfig)) {
          methodMap.set(method.toUpperCase(), behavior as BehaviorConfig);
        }
      }
      this.behaviorMap.set(route, methodMap);
    }
  }
}
