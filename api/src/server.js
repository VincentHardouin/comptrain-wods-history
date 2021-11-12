const config = require('./config');
const server = require('./app')({ logger: config.logger });

module.exports = {
  server,

  async start() {
    try {
      await server.listen(config.server.port, config.server.host);

      // https://www.fastify.io/docs/latest/Server/#printroutes
      server.ready(() => {
        server.log.info(server.printRoutes());
      });
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  },
};
