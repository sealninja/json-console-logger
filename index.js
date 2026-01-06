/* global console, module */
/* eslint no-console: "off" */
/* eslint guard-for-in: "off" */

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
  const parseObject = (obj, seen) => {
    if (!obj) return obj;
    if (typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((p) => parseObject(p, [...seen, p]));
    }
    if (obj instanceof Date) {
      return obj.toISOString();
    }
    const result = {};
    if (obj.constructor && obj.constructor.name && obj.constructor.name.endsWith('Error')) {
      result.error = obj.constructor.name;
      result.message = obj.message;
      result.stack = obj.stack;
    }
    Object.keys(obj).forEach((key) => {
      result[key] = seen.includes(obj[key]) ? '<circular>' : parseObject(obj[key], [...seen, obj[key]]);
    });
    return result;
  };
  return parseObject(value, [value]);
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
