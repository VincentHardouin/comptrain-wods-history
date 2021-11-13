const axios = require('axios');
const htmlParser = require('node-html-parser');
const config = require('../config');

module.exports = async function getComptrainWodAndSaveIt({
  workoutRepository = require('../repositories/workout-repository'),
} = {}) {
  const response = await axios.get(config.comptrainUrl);
  const parsedHtml = htmlParser.parse(response.data);
  console.log(response.data);
  const wod = parsedHtml.querySelector('#wod > .row  > .col');
  wod.removeChild(wod.querySelector('h2'));

  const titleNode = wod.querySelector('em');
  const title = titleNode.textContent;
  wod.childNodes[2].removeChild(titleNode);

  workoutRepository.save({ content: wod.textContent.trim(), title: title.trim() });
};
