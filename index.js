/* eslint no-console: "off" */

const callbacks = {};

let settings = {
  log: true,
  info: true,
  warn: true,
  error: true,
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
  if (!settings[level]) return null;

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
    timestamp: new Date().toISOString(),
  });
  console[level](json);
  if (callbacks[level]) {
    callbacks[level](message);
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
  setLogging: (newSettings) => { settings = { ...settings, ...newSettings }; },
  log: (...values) => logJSON('log', ...values),
  info: (...values) => logJSON('info', ...values),
  warn: (...values) => logJSON('warn', ...values),
  error: (...values) => logJSON('error', ...values),
};
