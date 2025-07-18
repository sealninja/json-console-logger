/* global console */
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
  if (value && typeof value === 'object' && value.constructor && value.constructor.name && value.constructor.name.endsWith('Error')) {
    const error = {
      error: value.constructor.name,
      message: value.message,
      stack: value.stack,
    };
    Object.keys(value).forEach((key) => {
      error[key] = value[key];
    });
    return error;
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
  const objects = [];
  const json = JSON.stringify(
    {
      level: level.toUpperCase(),
      message,
      // timestamp: new Date().toISOString(),
    },
    (key, value) => {
      // Filtering out properties
      if (typeof value === 'object') {
        if (objects.includes(value)) return 'object';
        objects.push(value);
        return value;
      }
      return value;
    },
  );
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

export default {
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
