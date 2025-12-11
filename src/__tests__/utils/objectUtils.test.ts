import { assignExistingKeys, isStructuralMatch } from '../../utils/objectUtils';
describe('objectUtils', () => {
  describe('assignExistingKeys', () => {
    it('should assign only existing keys from source to target', () => {
      const target = { a: 1, b: 2, nested: { c: 3 } };
      const source = { a: 10, x: 20, nested: { c: 30, d: 40 } };

      assignExistingKeys(target, source);

      expect(target).toEqual({
        a: 10,
        b: 2,
        nested: {
          c: 30,
        },
      });
    });

    it('should handle null or undefined source', () => {
      const target = { a: 1 };

      assignExistingKeys(target, null);
      expect(target).toEqual({ a: 1 });

      assignExistingKeys(target, undefined);
      expect(target).toEqual({ a: 1 });
    });

    it('should handle nested objects', () => {
      const target = {
        a: { b: 1, c: 2 },
        d: 3,
      };
      const source = {
        a: { b: 10, d: 40 },
        d: 30,
      };

      assignExistingKeys(target, source);

      expect(target).toEqual({
        a: { b: 10, c: 2 },
        d: 30,
      });
    });
  });

  describe('isStructuralMatch', () => {
    it('should compare objects correctly (keys)', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };
      const obj3 = { a: 1, b: { c: 3 } };

      expect(isStructuralMatch(obj1, obj2)).toBe(true);
      expect(isStructuralMatch(obj1, obj3)).toBe(true);
    });

    it('should handle complex nested structures', () => {
      const obj1 = {
        a: 1,
        b: [1, 2, { c: 3 }],
        c: { d: [4, 5] },
      };
      const obj2 = {
        a: 1,
        b: [1, 2, { c: 3 }],
        c: { d: [4, 5] },
      };
      const obj3 = {
        a: 1,
        b: [1, 2, { c: 4 }],
        c: { d: [4, 5] },
      };

      expect(isStructuralMatch(obj1, obj2)).toBe(true);
      expect(isStructuralMatch(obj1, obj3)).toBe(true);
    });
  });
});
