/* eslint no-console: "off" */

const parseValue = (value) => {
  if (value && typeof value === 'object' && value.constructor && value.constructor.name && value.constructor.name.endsWith('Error')) {
    const error = {
      error: value.constructor.name,
      message: value.message,
      stack: value.stack,
    };
    Object.keys(value).forEach((key) => {
      error[key] = JSON.stringify(value[key]);
    });
    return error;
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
