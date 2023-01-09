const axios = require('axios');
jest.mock('axios');
const usecase = require('../../../src/usecases/get-comptrain-wod-and-save-it');

describe('Unit | Use cases | get-comptrain-wod-and-save-it', () => {
  function mockedData(wod) {
    return {
      data: { items: [{ caption: { text: wod } }] },
    };
  }

  it('should find the wod and save it', async () => {
    const wod = 'WOD 11.13.2021 \n For Time:\n1,000 Box Step-Ups (45/35)\nKilos: (20/16)';
    axios.get.mockResolvedValueOnce(mockedData(wod));

    const workoutRepository = {
      save: jest.fn(),
    };

    await usecase.getComptrainWodAndSaveIt({ workoutRepository });

    expect(workoutRepository.save).toHaveBeenCalledWith({
      title: 'WOD 11.13.2021',
      content: `For Time:\n1,000 Box Step-Ups (45/35)\nKilos: (20/16)`,
    });
  });

  describe('when it is not a wod', () => {
    it('should not saved', async () => {
      const wod = ' Another description';
      axios.get.mockResolvedValueOnce(mockedData(wod));

      const workoutRepository = {
        save: jest.fn(),
      };

      await usecase.getComptrainWodAndSaveIt({ workoutRepository });

      expect(workoutRepository.save).not.toHaveBeenCalled();
    });
  });
});
