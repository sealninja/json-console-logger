# json-console-logger
Super light-weight stand-in replacement for console.log to only output JSON

[![NPM version][version-image]][npm-url]

## Installation

`npm i json-console-logger --save`

## Usage

```javascript
import logger from 'json-console-logger';

logger.log('a string');
// => console.log('{"level":"LOG","msg":"a string","timestamp":"2017-10-19T13:17:05.065Z"}');

logger.log('a string', 'another string');
// => console.log('{"level":"LOG","msg":["a string","another string"],"timestamp":"2017-10-19T13:17:05.065Z"}');

logger.info('a string', { an: 'object' });
// => console.info('{"level":"INFO","msg":["a string",{"an":"object"}],"timestamp":"2017-10-19T13:17:05.065Z"}');

logger.warn('a string', ['an', 'array']);
// => console.warn('{"level":"WARN","msg":["a string",["an","array"]],"timestamp":"2017-10-19T13:17:05.065Z"}');

logger.error('a string', new Error('an error'));
// => console.error('{"level":"ERROR","msg":["a string",{"error":"Error","message":"an error","stack":"..."}],"timestamp":"2017-10-19T13:17:05.065Z"}');
```

[version-image]: https://img.shields.io/npm/v/json-console-logger.svg

[npm-url]: https://npmjs.org/package/json-console-logger
