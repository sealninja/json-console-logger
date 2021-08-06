/* eslint no-console: "off" */

const callbacks = {};

let configuration = {
  log: true,
  info: true,
  warn: true,
  error: true,
  logger: console.log,
};

const parseValue = (value) => {
  if (
    value
    && typeof value === 'object'
    && value.constructor
    && value.constructor.name
    && value.constructor.name.endsWith('Error')
  ) {
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
  on,
  setConfiguration: (newConfiguration) => {
    configuration = { ...configuration, ...newConfiguration };
  },
  log: (...values) => logJSON('log', ...values),
  info: (...values) => logJSON('info', ...values),
  warn: (...values) => logJSON('warn', ...values),
  error: (...values) => logJSON('error', ...values),
};
