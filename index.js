/* global console, module */
/* eslint no-console: "off" */

const callbacks = {};

let configuration = {
  debug: true,
  error: true,
  info: true,
  log: true,
  logger: console.log,
  warn: true,
};

const parseValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => parseValue(v));
  }

  if (typeof value === 'object') {
    const object = {};
    if (Error.isError(value)) {
      object.error = value.constructor.name;
      object.message = value.message;
      object.stack = value.stack;
    }
    Object.keys(value).forEach((key) => {
      try {
        object[key] = parseValue(JSON.parse(JSON.stringify(value[key])));
      } catch (e) {
        object[key] = 'JSON console logging failed';
      }
    });
    return object;
  }
  
  return value;
};

const logJSON = (level, ...values) => {
  if (!configuration[level]) return null;

  let message = '';
  if (values.length === 1) {
    message = parseValue(values[0]);
  }
  if (values.length > 1) {
    message = values.map((v) => parseValue(v));
  }
  const json = JSON.stringify({
    level: level.toUpperCase(),
    message,
    // timestamp: new Date().toISOString(),
  });
  configuration.logger(json);
  if (callbacks[level]) {
    callbacks[level](json);
  }
  return json;
};

const on = (level, callback) => {
  if (typeof callback === 'function') {
    callbacks[level] = callback;
  }
};

module.exports = {
  debug: (...values) => logJSON('debug', ...values),
  error: (...values) => logJSON('error', ...values),
  info: (...values) => logJSON('info', ...values),
  log: (...values) => logJSON('log', ...values),
  on,
  setConfiguration: (newConfiguration) => {
    configuration = { ...configuration, ...newConfiguration };
  },
  warn: (...values) => logJSON('warn', ...values),
};
