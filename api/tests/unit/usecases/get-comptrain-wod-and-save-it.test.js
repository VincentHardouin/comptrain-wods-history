const axios = require('axios');
jest.mock('axios');
const usecase = require('../../../src/usecases/get-comptrain-wod-and-save-it');

describe('Unit | Use cases | get-comptrain-wod-and-save-it', () => {
  function mockedData(wod) {
    return {
      data:
        '<html><body><h1>Test</h1><div id="wod" class="col">\n' +
        '          <div class="row">\n' +
        '            <div class="col">\n' +
        wod +
        '            </div>\n' +
        '            <div class="col-lg-6">\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>' +
        '</body></html>',
    };
  }

  it('should parse html, find the wod and save it', async () => {
    const wod =
      '<h2>Saturday // 11.13.2021</h2>\n' +
      '<p><em><strong>&#8220;Chad&#8221;<br />\n' +
      '</strong></em>For Time:<br />\n' +
      '1,000 Box Step-Ups (45/35)</p>\n' +
      '<p>Kilos: (20/16)</p>\n';
    axios.get.mockResolvedValueOnce(mockedData(wod));

    const workoutRepository = {
      save: jest.fn(),
    };

    await usecase.getComptrainWodAndSaveIt({ workoutRepository });

    expect(workoutRepository.save).toHaveBeenCalledWith({
      title: '“Chad”',
      content: `For Time:\n1,000 Box Step-Ups (45/35)\nKilos: (20/16)`,
    });
  });

  describe('when it is rest day', () => {
    it('should not saved in active recovery', async () => {
      const wod = '<p>Optional Active Recovery!</p>';
      axios.get.mockResolvedValueOnce(mockedData(wod));

      const workoutRepository = {
        save: jest.fn(),
      };

      await usecase.getComptrainWodAndSaveIt({ workoutRepository });

      expect(workoutRepository.save).not.toHaveBeenCalled();
    });

    it('should not saved in rest day', async () => {
      const wod = '<p>Rest day!</p>';
      axios.get.mockResolvedValueOnce(mockedData(wod));

      const workoutRepository = {
        save: jest.fn(),
      };

      await usecase.getComptrainWodAndSaveIt({ workoutRepository });

      expect(workoutRepository.save).not.toHaveBeenCalled();
    });
  });
});
