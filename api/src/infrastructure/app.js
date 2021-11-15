const fastify = require('fastify');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function build({ logger }) {
  const server = fastify({
    logger,
  });

  server.get('/ping', async () => {
    return 'pong\n';
  });

  server.get('/workouts', async () => {
    try {
      return await prisma.workout.findMany({ orderBy: { id: 'desc' } });
    } finally {
      await prisma.$disconnect();
    }
  });

  return server;
}

module.exports = build;
