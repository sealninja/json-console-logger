/* eslint no-console: "off" */

const parseValue = (value) => {
  if (typeof value === 'object' && value.constructor.name.endsWith('Error')) {
    return {
      error: value.constructor.name,
      message: value.message,
      stack: value.stack,
    };
  }
  return value;
};

const toJSON = (level, ...values) => {
  let msg = '';
  if (values.length === 1) {
    msg = parseValue(values[0]);
  }
  if (values.length > 1) {
    msg = values.map(v => parseValue(v));
  }
  return JSON.stringify({
    level: level.toUpperCase(),
    msg,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  toJSON,
  log: () => console.log(toJSON('log', arguments)),
  info: () => console.info(toJSON('info', arguments)),
  warn: () => console.warn(toJSON('warn', arguments)),
  error: () => console.error(toJSON('error', arguments)),
};
