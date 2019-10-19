'use strict'
const alphaVantageService = require('./services/alphaVantage');
const pubsubService = require('./services/pubsub');
const storageService = require('./services/storage');

exports.dailyInfo = async (event) => {
  const symbol = pubsubService.parseMessage(event);
  const dailyInfoData = await alphaVantageService.dailyInfo(symbol);
  const dataSize = dailyInfoData.meta.dataLenght;
  console.log(`${dataSize} objects retrieved from API for ${symbol}`);

  await storageService.saveData(`${symbol}.json`, 'api-responses', dailyInfoData);
  console.log(`${dataSize} stored for ${symbol}`);
};

const { DAILY_INFO_TOPIC } = process.env;

exports.minuteLoader = async () => {
  // 1 - get files in current date bucket path
  // 2 - verify which are not yet download
  // 3 - select 4
  await pubsubService.publishMessage('MSFT', DAILY_INFO_TOPIC);
};

exports.apiResponseFilter = async (file) => {
  console.log(`Triggered by file: ${file.name}`);
};
