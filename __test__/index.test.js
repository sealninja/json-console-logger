/* global describe, test, expect */

const logger = require('../index');

['log', 'info', 'warn', 'error'].forEach((level) => {
  describe(level, () => {
    const expectAllProperties = (result) => {
      expect(JSON.parse(result)).toBeTruthy();
      expect(JSON.parse(result)).toHaveProperty('level');
      expect(JSON.parse(result)).toHaveProperty('message');
      expect(JSON.parse(result)).toHaveProperty('timestamp');
      expect(result).toEqual(expect.stringContaining(`"level":"${level.toUpperCase()}"`));
    };

    test('single string', () => {
      const result = logger[level]('a string');
      expectAllProperties(result);
      expect(result).toEqual(expect.stringContaining('"message":"a string"'));
    });

    test('two strings', () => {
      const result = logger[level]('a string', 'another string');
      expectAllProperties(result);
      expect(result).toEqual(expect.stringContaining('"message":["a string","another string"]'));
    });

    test('string + object', () => {
      const result = logger[level]('a string', { an: 'object' });
      expectAllProperties(result);
      expect(result).toEqual(expect.stringContaining('"message":["a string",{"an":"object"}]'));
    });

    test('string + array', () => {
      const result = logger[level]('a string', ['an', 'array']);
      expectAllProperties(result);
      expect(result).toEqual(expect.stringContaining('"message":["a string",["an","array"]]'));
    });

    test('string + error', () => {
      const result = logger[level]('a string', new Error('an error'));
      expectAllProperties(result);
      expect(result).toEqual(expect.stringContaining('"message":["a string",{"error":"Error","message":"an error","stack":'));
    });

    test('string + range error', () => {
      const result = logger[level]('a string', new RangeError('a range error'));
      expectAllProperties(result);
      expect(result).toEqual(expect.stringContaining('"message":["a string",{"error":"RangeError","message":"a range error","stack":'));
    });

    test('string + custom error', () => {
      const error = new Error('custom error');
      error.status = 400;
      error.response = { text: 'bad request error' };
      const result = logger[level]('a string', error);
      expectAllProperties(result);
      expect(result).toEqual(expect.stringContaining('"message":["a string",{"error":"Error","message":"custom error","stack":'));
      expect(result).toEqual(expect.stringContaining('"status":400,"response":{"text":"bad request error"}'));
    });

    test('callback string', () => {
      let callbackMessage;
      logger.on(level, (message) => {
        callbackMessage = message;
      });
      logger[level]('a callback string');
      expect(callbackMessage).toEqual('a callback string');
    });

    test('logging off', () => {
      logger.setConfiguration({ [level]: false });
      const result = logger[level]('a string');
      expect(result).toBeFalsy();
      logger.setConfiguration({ [level]: true });
    });
  });
});
