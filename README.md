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
// => console.log('{"level":"LOG","message":"a string"}');

logger.log('a string', 'another string');
// => console.log('{"level":"LOG","message":["a string","another string"]}');

logger.info('a string', { an: 'object' });
// => console.info('{"level":"INFO","message":["a string",{"an":"object"}]}');

logger.warn('a string', ['an', 'array']);
// => console.warn('{"level":"WARN","message":["a string",["an","array"]]}');

logger.error('a string', new Error('an error'));
// => console.error('{"level":"ERROR","message":["a string",{"error":"Error","message":"an error","stack":"..."}]}');
```

## Callbacks

```javascript
import logger from 'json-console-logger';

logger.on('error', (message) => {
  // do something
});

logger.error('an error string');
// => console.error('{"level":"ERROR","message":"an error string"}');
// => callback will be called with '{"level":"ERROR","message":"an error string"}' as argument

logger.error('a string', new Error('an error'));
// => console.error('{"level":"ERROR","message":["a string",{"error":"Error","message":"an error","stack":"..."}]}');
// => callback will be called with '{"level":"ERROR","message":["a string",{"error":"Error","message":"an error","stack":"..."}]}' as argument
```

## Disable log levels

```javascript
import logger from 'json-console-logger';

logger.setConfiguration({ log: false, info: false });

logger.log('a string');
// => logs nothing

logger.info('a string');
// => logs nothing

logger.warn('an warn string');
// => console.error('{"level":"WARN","message":"an warn string"}');

logger.error('an error string');
// => console.error('{"level":"ERROR","message":"an error string"}');
```

## Other output than `console.log`

```javascript
import logger from 'json-console-logger';

logger.setConfiguration({ logger: (msg) => process.stdout.write(`${msg}\n`) });

logger.log('a string');
// => process.stdout.write('{"level":"LOG","message":"a string"}\n');
```

[version-image]: https://img.shields.io/npm/v/json-console-logger.svg

[npm-url]: https://npmjs.org/package/json-console-logger


## License

MIT
