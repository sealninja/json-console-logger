/* eslint no-console: "off" */

const parseValue = (value) => {
  if (value && typeof value === 'object' && value.constructor && value.constructor.name && value.constructor.name.endsWith('Error')) {
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
  log: (...values) => console.log(toJSON('log', ...values)),
  info: (...values) => console.info(toJSON('info', ...values)),
  warn: (...values) => console.warn(toJSON('warn', ...values)),
  error: (...values) => console.error(toJSON('error', ...values)),
};
