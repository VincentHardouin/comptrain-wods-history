const axios = require('axios');
const config = require('../config');

module.exports = {
  async getComptrainWodAndSaveIt({
    workoutRepository = require('../infrastructure/repositories/workout-repository'),
  } = {}) {
    try {
      const response = await axios.get(config.comptrain.url, {
        headers: { 'User-Agent': 'Instagram 219.0.0.12.117 Android' },
      });
      const text = response.data.items[0].caption.text;
      if (!text.includes('WOD')) {
        return;
      }
      const title = text.split('\n')[0].trim();
      const content = text.split('\n').slice(1).join('\n').split('Featured Athlete')[0].trim();

      await workoutRepository.save({ content, title });
    } catch (e) {
      if (e.response?.status == 404) {
        console.log("La page n'existe pas");
        return;
      }
      throw e;
    }
  },
};
