import { Request, Response } from 'express';
import {
  getCollection,
  getCollectionItem,
  postCollection,
  putCollectionItem,
  patchCollectionItem,
  deleteCollectionItem,
} from '../../../server/handlers/collectionHandlers';

describe('Collection Handlers', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  let storeData: any;
  let mockStore: any;

  const collectionName = 'items';

  beforeEach(() => {
    storeData = {
      [collectionName]: [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
      ],
    };

    mockStore = {
      get: jest.fn(() => storeData),
      set: jest.fn((newState) => {
        storeData = newState;
      }),
    };

    responseObject = undefined;

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse as Response;
      }),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe('getCollection', () => {
    it('should return all items', () => {
      const handler = getCollection(mockStore, collectionName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(storeData[collectionName]);
    });
  });

  describe('getCollectionItem', () => {
    it('should return the item with the specified id', () => {
      mockRequest.params = { id: '1' };

      const handler = getCollectionItem(mockStore, collectionName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(storeData[collectionName][0]);
    });

    it('should return 404 if item not found', () => {
      mockRequest.params = { id: '999' };

      const handler = getCollectionItem(mockStore, collectionName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({ error: 'Item not found' });
    });
  });

  describe('postCollection', () => {
    it('should add a new item', () => {
      mockRequest.body = {
        id: 3, // REQUIRED to match schema
        name: 'Item 3',
        value: 300,
      };

      const handler = postCollection(mockStore, collectionName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(storeData[collectionName]).toHaveLength(3);
      expect(storeData[collectionName][2]).toEqual({
        id: 3,
        name: 'Item 3',
        value: 300,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRequest.body);
    });

    it('should reject invalid schema', () => {
      mockRequest.body = { id: 3, invalidField: 'test' };

      const handler = postCollection(mockStore, collectionName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        rejected: 'Invalid payload: keys do not match resource schema',
      });
    });
  });

  describe('putCollectionItem', () => {
    it('should replace an existing item', () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        id: 1, // REQUIRED
        name: 'Updated Item',
        value: 150,
      };

      const handler = putCollectionItem(mockStore, collectionName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(storeData[collectionName][0]).toEqual({
        id: 1,
        name: 'Updated Item',
        value: 150,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(storeData[collectionName][0]);
    });

    it('should reject invalid schema', () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { invalidField: 'test' };

      const handler = putCollectionItem(mockStore, collectionName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        rejected: 'Invalid payload: keys do not match resource schema',
      });
    });
  });

  describe('patchCollectionItem', () => {
    it('should partially update an item', () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { value: 999 };

      const handler = patchCollectionItem(mockStore, collectionName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(storeData[collectionName][0]).toEqual({
        id: 1,
        name: 'Item 1',
        value: 999,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ value: 999 });
    });
  });

  describe('deleteCollectionItem', () => {
    it('should delete an item', () => {
      mockRequest.params = { id: '1' };

      const handler = deleteCollectionItem(mockStore, collectionName);
      handler(mockRequest as Request, mockResponse as Response);

      expect(storeData[collectionName]).toHaveLength(1);
      expect(storeData[collectionName][0].id).toBe(2);

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
