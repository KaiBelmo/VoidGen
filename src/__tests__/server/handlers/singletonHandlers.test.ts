import { Request, Response } from 'express';
import {
  getSingleton,
  putSingleton,
  patchSingleton,
} from '../../../server/handlers/singletonHandlers';

describe('Singleton Handlers', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;
  let data: any;
  const resourceName = 'settings';

  beforeEach(() => {
    data = {
      settings: {
        theme: 'dark',
        notifications: true,
        fontSize: 14,
      },
    };

    mockRequest = {};
    mockResponse = {
      statusCode: 0,
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse as Response;
      }),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getSingleton', () => {
    it('should return the singleton data', () => {
      const handler = getSingleton(data, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(data.settings);
    });

    it('should return undefined for non-existent resource', () => {
      const handler = getSingleton(data, 'nonExistent');
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(undefined);
    });
  });

  describe('putSingleton', () => {
    it('should replace the entire singleton data when keys match', () => {
      const newSettings = {
        theme: 'light',
        notifications: false,
        fontSize: 20, // must include ALL keys to match schema
      };

      mockRequest.body = newSettings;

      const handler = putSingleton(data, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(data.settings).toEqual(newSettings);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({ received: newSettings });
    });

    it('should reject updates when keys do not match schema', () => {
      const invalidUpdate = { theme: 'light' }; // missing keys

      mockRequest.body = invalidUpdate;

      const handler = putSingleton(data, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        rejected: 'Invalid payload: keys do not match resource schema',
      });
    });

    it('should reject creation when resource does not exist', () => {
      const newData: any = {};
      const newSettings = { theme: 'light' };

      mockRequest.body = newSettings;

      const handler = putSingleton(newData, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(newData[resourceName]).toBeUndefined(); // no creation
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
  describe('patchSingleton', () => {
    it('should partially update only existing keys', () => {
      const update = { theme: 'light' };

      mockRequest.body = update;

      const handler = patchSingleton(data, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(data.settings.theme).toBe('light');
      expect(data.settings.notifications).toBe(true);
      expect(data.settings.fontSize).toBe(14);
      expect(data.settings.language).toBeUndefined(); // no new keys allowed

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should NOT add new fields', () => {
      const update = { language: 'en' };

      mockRequest.body = update;

      const handler = patchSingleton(data, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(data.settings.language).toBeUndefined(); // ignored
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should NOT create the resource if it does not exist', () => {
      const newData: any = {};
      const update = { theme: 'light' };

      mockRequest.body = update;

      const handler = patchSingleton(newData, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(newData[resourceName]).toBeUndefined(); // no creation
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({ received: undefined });
    });
  });
});
