import { JsonDataSource } from '../../datasource/JsonDataSource';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

describe('JsonDataSource', () => {
  const testFilePath = join(__dirname, 'test-data.json');

  beforeEach(() => {
    // Create a test JSON file
    const testData = {
      users: [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Doe' },
      ],
      settings: {
        theme: 'dark',
        notifications: true,
      },
    };
    writeFileSync(testFilePath, JSON.stringify(testData));
  });

  afterEach(() => {
    // Clean up test file
    try {
      unlinkSync(testFilePath);
    } catch (_) {
      // File may not exist, which is fine
    }
  });

  describe('load', () => {
    it('should load and parse JSON file', () => {
      const dataSource = new JsonDataSource(testFilePath);
      const data = dataSource.load();

      expect(data).toEqual({
        users: [
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Doe' },
        ],
        settings: {
          theme: 'dark',
          notifications: true,
        },
      });
    });
  });

  describe('parse', () => {
    it('should parse raw data into ResourceMap', () => {
      const dataSource = new JsonDataSource(testFilePath);
      const rawData = {
        users: [
          { id: '1', name: 'User 1' },
          { id: '2', name: 'User 2' },
        ],
        settings: { theme: 'light' },
      };

      const result = dataSource.parse(rawData);

      expect(result.size).toBe(2);
      expect(result.get('users')).toEqual({
        type: 'collection',
        name: 'users',
        items: [
          { id: '1', name: 'User 1' },
          { id: '2', name: 'User 2' },
        ],
      });
      expect(result.get('settings')).toEqual({
        type: 'singleton',
        name: 'settings',
        value: { theme: 'light' },
      });
    });

    it('should handle empty object', () => {
      const dataSource = new JsonDataSource(testFilePath);
      const result = dataSource.parse({});
      expect(result.size).toBe(0);
    });

    it('should ignore non-object and non-array values', () => {
      const dataSource = new JsonDataSource(testFilePath);
      const rawData = {
        users: 'not an array',
        count: 5,
        active: true,
        settings: { theme: 'dark' },
      };

      const result = dataSource.parse(rawData);
      expect(result.size).toBe(1);
      expect(result.has('settings')).toBe(true);
    });
  });

  describe('integration', () => {
    it('should load and parse the test file', () => {
      const dataSource = new JsonDataSource(testFilePath);
      const data = dataSource.load();
      const resourceMap = dataSource.parse(data);

      expect(resourceMap.size).toBe(2);
      expect(resourceMap.get('users')?.type).toBe('collection');
      expect(resourceMap.get('settings')?.type).toBe('singleton');
    });
  });
});
