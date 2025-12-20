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

  let storeData: any;
  let mockStore: any;

  const resourceName = 'settings';

  beforeEach(() => {
    storeData = {
      settings: {
        theme: 'dark',
        notifications: true,
        fontSize: 14,
      },
    };

    mockStore = {
      get: jest.fn(() => storeData),
      set: jest.fn((newState) => {
        storeData = newState;
      }),
    };

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse as Response;
      }),
    };
  });

  describe('getSingleton', () => {
    it('should return the singleton data', () => {
      const handler = getSingleton(mockStore, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(storeData.settings);
    });

    it('should return undefined for non-existent resource', () => {
      const handler = getSingleton(mockStore, 'nonExistent');
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(undefined);
    });
  });

  describe('putSingleton', () => {
    it('should replace the entire singleton when schema matches', () => {
      const newSettings = {
        theme: 'light',
        notifications: false,
        fontSize: 20,
      };

      mockRequest.body = newSettings;

      const handler = putSingleton(mockStore, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(storeData.settings).toEqual(newSettings);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({ received: newSettings });
    });

    it('should reject updates when schema does not match', () => {
      mockRequest.body = { theme: 'light' };

      const handler = putSingleton(mockStore, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        rejected: 'Invalid payload: keys do not match resource schema',
      });
    });

    it('should reject when resource does not exist', () => {
      storeData = {}; // no settings key

      mockRequest.body = { theme: 'light' };

      const handler = putSingleton(mockStore, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(storeData.settings).toBeUndefined();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('patchSingleton', () => {
    it('should partially update existing keys only', () => {
      mockRequest.body = { theme: 'light' };

      const handler = patchSingleton(mockStore, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(storeData.settings).toEqual({
        theme: 'light',
        notifications: true,
        fontSize: 14,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({ received: storeData.settings });
    });

    it('should ignore new fields', () => {
      mockRequest.body = { language: 'en' };

      const handler = patchSingleton(mockStore, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(storeData.settings.language).toBeUndefined();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should NOT create resource if it does not exist', () => {
      storeData = {};

      mockRequest.body = { theme: 'light' };

      const handler = patchSingleton(mockStore, resourceName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(storeData.settings).toBeUndefined();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({ received: undefined });
    });
  });
});
