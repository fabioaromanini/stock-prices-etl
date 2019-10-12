'use strict'
const alphaVantageService = require('./services/alphaVantage');
const cloudStorageClient = require('./services/cloudStorage');

exports.dailyInfo = async (request, response) => {
  const data = await alphaVantageService.dailyInfo('MSFT');
  await cloudStorageClient.uploadJsObject('test.json', 'api-responses', data);
  response.status(200).send(`${Object.keys(data).length} objects retrieved from API`);
};
