const axios = require('axios');
const htmlParser = require('node-html-parser');
const config = require('../config');

module.exports = {
  async getComptrainWodAndSaveIt({
    workoutRepository = require('../infrastructure/repositories/workout-repository'),
  } = {}) {
    const response = await axios.get(config.comptrain.url);
    const parsedHtml = htmlParser.parse(response.data);
    const wod = parsedHtml.querySelector('#wod > .row  > .col');
    wod.removeChild(wod.querySelector('h2'));

    const text = wod.textContent.trim().toLowerCase();
    if (text.includes('rest day') || text.includes('optional active recovery')) {
      return;
    }

    const titleNode = wod.querySelector('em');
    const title = titleNode.textContent;
    wod.childNodes[2].removeChild(titleNode);

    const content = wod.textContent.trim();

    await workoutRepository.save({ content, title: title.trim() });
  },
};
