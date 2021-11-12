const fastify = require('fastify');

function build({ logger }) {
  const server = fastify({
    logger,
  });

  server.get('/ping', async () => {
    return 'pong\n';
  });

  return server;
}

module.exports = build;
