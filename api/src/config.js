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

const environment = buildEnvironment();

module.exports = environment;
