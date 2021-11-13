const pino = require('pino');
const { environment } = require('../config');

function build() {
  return pino({
    enabled: environment.logger.enabled,
    level: environment.logger.level,
    transport: {
      target: 'pino-pretty',
    },
  });
}

module.exports = { build };
