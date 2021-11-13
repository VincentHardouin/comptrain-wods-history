const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  save(workout) {
    return prisma.workout.create({ data: workout });
  },
};
