import { readFileSync, existsSync } from 'fs';
import { BehaviorConfig } from '@/types/behavior';
import { BehaviorMap, MethodBehaviorMap } from '@/types/map';
import { getFileName } from '@/utils/getFileName';

export class BehaviorManager {
  private behaviorMap: BehaviorMap = new Map();
  private configPath!: string;

  constructor(configPath: string) {
    if (this.checkIfLoadFileExists(configPath)) this.loadConfig();
  }

  private checkIfLoadFileExists(filePath: string): boolean {
    const fileName = getFileName(filePath);
    const path = `${fileName}.config.json`;
    if (existsSync(path)) {
      this.configPath = path;
      return true;
    }
    return false;
  }

  loadConfig() {
    const file = readFileSync(this.configPath, 'utf-8');
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

  getRouteBehavior(routeName: string): MethodBehaviorMap | null {
    return this.behaviorMap.get(routeName) ?? null;
  }

  getConfigPath(): string | null {
    return this.configPath || null;
  }
}
