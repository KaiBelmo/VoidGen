import { BehaviorMap } from 'src/types';

export class BehaviorManager {
  private behaviorMap: BehaviorMap = new Map();

  constructor(configPath: string) {
    this.loadConfig(configPath);
  }

  loadConfig(configPath: string) {
    console.log(configPath);
  }
}
