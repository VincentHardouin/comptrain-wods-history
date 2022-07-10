const usecase = require('../src/usecases/get-comptrain-wod-and-save-it');

(async () => {
  try {
    await usecase.getComptrainWodAndSaveIt();
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
  } finally {
  }
})();
