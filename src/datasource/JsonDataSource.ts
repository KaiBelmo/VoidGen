import { readFileSync } from 'fs';
import { DataSource } from '@/datasource/DataSource';
import type { ResourceMap } from '@/types/resource';

export class JsonDataSource extends DataSource {
  load(): any {
    try {
      const data = readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error(`Failed to read file ${this.filePath}: `, e);
      throw e;
    }
  }

  parse(rawData: any): ResourceMap {
    const map: ResourceMap = new Map();
    for (const [key, value] of Object.entries(rawData)) {
      if (Array.isArray(value)) {
        map.set(key, { type: 'collection', name: key, items: value });
      } else if (typeof value === 'object' && value !== null) {
        map.set(key, { type: 'singleton', name: key, value });
      }
    }
    return map;
  }
}

// Future: Add YamlDataSource, etc., with yaml.load() or similar.
