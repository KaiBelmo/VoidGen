import type { ResourceMap } from '@/types/resource';

export abstract class DataSource {
  protected filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  abstract load(): any;

  abstract parse(rawData: any): ResourceMap;
}
