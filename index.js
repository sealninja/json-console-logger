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

const preventCircularObject = (value) => {
  try {
    JSON.parse(JSON.stringify(value));
    return value;
  } catch (e) {
    if (e.message.includes('circular')) return 'circular object';
    return 'object';
  }
};

const parseValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => parseValue(v));
  }

  if (typeof value === 'object') {
    const object = {};
    if (Error.isError(value)) {
      const error = value.constructor.name;
      const { message, stack } = value;
      object.error = error;
      object.message = message;
      object.stack = stack;
    }
    Object.keys(value).forEach((key) => {
      object[key] = parseValue(value[key]);
    });
    return object;
  }

  return value;
};

const logJSON = (level, ...values) => {
  if (!configuration[level]) return null;

  let message = '';
  if (values.length === 1) {
    message = parseValue(preventCircularObject(values[0]));
  }
  if (values.length > 1) {
    message = values.map((v) => parseValue(preventCircularObject(v)));
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
