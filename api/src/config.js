function buildEnvironment() {
  const env = {
    server: {
      port: process.env.PORT || 3000,
      host: process.env.HOST || 'localhost',
    },
    logger: {
      enabled: process.env.LOGGER_ENABLED || true,
      level: process.env.LOGGER_LEVEL || 'info',
    },
    comptrain: {
      url: process.env.COMPTRAIN_URL || 'https://comptrain.co/wod/',
      getWodSchedule: process.env.COMPTRAIN_GET_WOD_SCHEDULE || '0 7 * * *',
    },
  };

  if (process.env.NODE_ENV === 'production') {
    // Override properties according to production environment
  }

  if (process.env.NODE_ENV === 'test') {
    env.server.port = 0;
    env.logger.level = 'error';
  }

  return env;
}

module.exports = buildEnvironment();
