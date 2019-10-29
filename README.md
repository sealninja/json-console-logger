# JSON Console Logger
Super light-weight stand-in replacement for console logging to only output JSON

[![NPM version](https://img.shields.io/npm/v/json-console-logger.svg?style=flat-square)](https://npmjs.org/package/json-console-logger)
[![Downloads](https://img.shields.io/npm/dm/json-console-logger.svg?style=flat-square)](https://npmjs.org/package/json-console-logger)
[![Dependency Status](https://img.shields.io/david/sealninja/json-console-logger?style=flat-square)](https://david-dm.org/sealninja/json-console-logger)

## Installation

```
npm install json-console-logger --save
```

## Usage

```javascript
import logger from 'json-console-logger';

logger.log('a string');
// => console.log('{"level":"LOG","message":"a string","timestamp":"2017-10-19T13:17:05.065Z"}');

logger.log('a string', 'another string');
// => console.log('{"level":"LOG","message":["a string","another string"],"timestamp":"2017-10-19T13:17:05.065Z"}');

logger.info('a string', { an: 'object' });
// => console.info('{"level":"INFO","message":["a string",{"an":"object"}],"timestamp":"2017-10-19T13:17:05.065Z"}');

logger.warn('a string', ['an', 'array']);
// => console.warn('{"level":"WARN","message":["a string",["an","array"]],"timestamp":"2017-10-19T13:17:05.065Z"}');

logger.error('a string', new Error('an error'));
// => console.error('{"level":"ERROR","message":["a string",{"error":"Error","message":"an error","stack":"..."}],"timestamp":"2017-10-19T13:17:05.065Z"}');
```

## Callbacks

```javascript
import logger from 'json-console-logger';

logger.on('error', (message) => {
  // do something
});

logger.error('an error string');
// => console.error('{"level":"ERROR","message":"an error string","timestamp":"2017-10-19T13:17:05.065Z"}');
// => error handler will be called with "an error string" as argument
```

[version-image]: https://img.shields.io/npm/v/json-console-logger.svg

[npm-url]: https://npmjs.org/package/json-console-logger

## License

MIT

<a href="https://sealninja.com"><img src="https://sealninja.com/assets/badge.png" alt="Sealninja" height="96"></a>
