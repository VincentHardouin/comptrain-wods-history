const server = require('./src/infrastructure/server');
const config = require('./src/config');
const { createCronJob } = require('./src/infrastructure/cron-job');
const getComptrainWod = require('./src/usecases/get-comptrain-wod-and-save-it');

server.start();

createCronJob(
  'get-wod-everyday',
  () => {
    getComptrainWod.getComptrainWodAndSaveIt();
  },
  config.comptrain.getWodSchedule
);
