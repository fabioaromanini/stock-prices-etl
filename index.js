'use strict'
const alphaVantageService = require('./services/alphaVantage');
const storageService = require('./services/storage');

exports.dailyInfo = async (request, response) => {
  const dailyInfoData = await alphaVantageService.dailyInfo('MSFT');
  const dataSize = dailyInfoData.meta.dataLenght;
  console.log(`${dataSize} objects retrieved from API`);
  
  await storageService.saveData('test.json', 'api-responses', dailyInfoData);
  console.log(`${dataSize} stored`);

  response.status(200).send(JSON.stringify(dataSize));
};
