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
  let items: any[];

  beforeEach(() => {
    // IDs MUST be numbers because your implementation uses Number(req.params.id)
    items = [
      { id: 1, name: 'Item 1', value: 100 },
      { id: 2, name: 'Item 2', value: 200 },
    ];

    mockRequest = {};
    mockResponse = {
      statusCode: 0,
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse as Response;
      }),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe('getCollection', () => {
    it('should return all items', () => {
      const handler = getCollection(items);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(items);
    });
  });

  describe('getCollectionItem', () => {
    it('should return the item with the specified id', () => {
      mockRequest.params = { id: '1' }; // Express always provides params as strings
      const handler = getCollectionItem(items);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(items[0]);
    });

    it('should return 404 if item not found', () => {
      mockRequest.params = { id: '999' };
      const handler = getCollectionItem(items);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({ error: 'Item not found' });
    });
  });

  describe('postCollection', () => {
    it('should add a new item to the collection', () => {
      const newItem = { id: 3, name: 'Item 3', value: 300 };
      mockRequest.body = newItem;

      const handler = postCollection(items);
      handler(mockRequest as Request, mockResponse as Response);

      expect(items).toHaveLength(3);
      expect(items[2]).toEqual(newItem);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(newItem);
    });

    it('should validate schema for first item', () => {
      const newItem = { id: 3, invalidField: 'test' };
      mockRequest.body = newItem;

      // First add a valid item into an empty list
      const validHandler = postCollection([]);
      validHandler(mockRequest as Request, mockResponse as Response);

      // Then try to add an invalid item into the real collection
      const invalidHandler = postCollection(items);
      invalidHandler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        rejected: 'Invalid payload: keys do not match resource schema',
      });
    });
  });

  describe('putCollectionItem', () => {
    it('should update an existing item', () => {
      const updatedItem = { id: 1, name: 'Updated Item', value: 150 };
      mockRequest.params = { id: '1' };
      mockRequest.body = updatedItem;

      const handler = putCollectionItem(items);
      handler(mockRequest as Request, mockResponse as Response);

      expect(items[0]).toEqual(updatedItem);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedItem);
    });

    it('should validate schema on update', () => {
      const invalidUpdate = { id: 1, invalidField: 'test' };
      mockRequest.params = { id: '1' };
      mockRequest.body = invalidUpdate;

      const handler = putCollectionItem(items);
      handler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        rejected: 'Invalid payload: keys do not match resource schema',
      });
    });
  });

  describe('patchCollectionItem', () => {
    it('should partially update an existing item', () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { value: 150 };

      const handler = patchCollectionItem(items);
      handler(mockRequest as Request, mockResponse as Response);

      expect(items[0].value).toBe(150);
      expect(items[0].name).toBe('Item 1'); // untouched
      expect(mockResponse.json).toHaveBeenCalledWith(items[0]);
    });
  });

  describe('deleteCollectionItem', () => {
    it('should remove the specified item', () => {
      mockRequest.params = { id: '1' };

      const handler = deleteCollectionItem(items);
      handler(mockRequest as Request, mockResponse as Response);

      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(2); // Number, not string
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
