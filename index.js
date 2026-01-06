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

const parseValue = (value, seenObjects = []) => {
  if (typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => parseValue(v, [...seenObjects, v]));
  }
  const result = {};
  if (value.constructor && value.constructor.name && value.constructor.name.endsWith('Error')) {
    const error = value.constructor.name;
    result.error = error;
    result.message = value.message;
    result.stack = value.stack;
  }
  for (const key in value) {
    if (seenObjects.includes(value[key])) {
      result[key] = '<circular>';
    } else {
      result[key] = parseValue(value[key], [...seenObjects, value[key]]);
    }
  }
  return result;
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
