/* global describe, test, expect */

const logger = require('../index');

['log', 'info', 'warn', 'error'].forEach((level) => {
  describe(level, () => {
    const genericExpect = (result) => {
      expect(JSON.parse(result)).toBeTruthy();
      expect(JSON.parse(result)).toHaveProperty('level');
      expect(JSON.parse(result)).toHaveProperty('msg');
      expect(JSON.parse(result)).toHaveProperty('timestamp');
      expect(result).toEqual(expect.stringContaining(`"level":"${level.toUpperCase()}"`));
    };

    test('single string', () => {
      const result = logger.toJSON(level, 'a string');
      genericExpect(result);
      expect(result).toEqual(expect.stringContaining('"msg":"a string"'));
    });

    test('two strings', () => {
      const result = logger.toJSON(level, 'a string', 'another string');
      genericExpect(result);
      expect(result).toEqual(expect.stringContaining('"msg":["a string","another string"]'));
    });

    test('string + object', () => {
      const result = logger.toJSON(level, 'a string', { an: 'object' });
      genericExpect(result);
      expect(result).toEqual(expect.stringContaining('"msg":["a string",{"an":"object"}]'));
    });

    test('string + array', () => {
      const result = logger.toJSON(level, 'a string', ['an', 'array']);
      genericExpect(result);
      expect(result).toEqual(expect.stringContaining('"msg":["a string",["an","array"]]'));
    });

    test('string + error', () => {
      const result = logger.toJSON(level, 'a string', new Error('an error'));
      genericExpect(result);
      expect(result).toEqual(expect.stringContaining('"msg":["a string",{"error":"Error","message":"an error","stack":'));
    });

    test('string + range error', () => {
      const result = logger.toJSON(level, 'a string', new RangeError('a range error'));
      genericExpect(result);
      expect(result).toEqual(expect.stringContaining('"msg":["a string",{"error":"RangeError","message":"a range error","stack":'));
    });
  });
});
