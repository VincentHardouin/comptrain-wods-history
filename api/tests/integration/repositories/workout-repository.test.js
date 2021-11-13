const workoutRepository = require('../../../src/infrastructure/repositories/workout-repository');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Integration | Repository | Workout', () => {
  describe('#save', () => {
    it('should persist workout in database and return it', async () => {
      const workout = {
        title: 'WOD1',
        content: '1 000 Squats',
      };

      const result = await workoutRepository.save(workout);

      const findInDatabase = await prisma.workout.findFirst({ where: { title: workout.title } });
      expect(findInDatabase.content).toEqual(workout.content);
      expect(result.content).toEqual(workout.content);
      expect(result.title).toEqual(workout.title);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });
});
