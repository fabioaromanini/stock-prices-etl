'use strict'
const alphaVantageService = require('./services/alphaVantage');
const pubsubService = require('./services/pubsub');
const storageService = require('./services/storage');
const dataParsingService = require('./services/dataParsing');

exports.extractStockData = async (event) => {
  const symbol = pubsubService.parseMessage(event);
  const dailyInfoData = await alphaVantageService.dailyInfo(symbol);
  const dataSize = dailyInfoData.meta.dataLenght;
  console.log(`${dataSize} objects retrieved from API for ${symbol}`);

  await storageService.saveJsonData(`${symbol}.json`, 'api-responses', dailyInfoData);
  console.log(`${dataSize} stored for ${symbol}`);
};

const { DAILY_INFO_TOPIC } = process.env;

exports.minuteLoader = async () => {
  // 1 - get files in current date bucket path
  // 2 - verify which are not yet download
  // 3 - select 4
  await pubsubService.publishMessage('MSFT', DAILY_INFO_TOPIC);
};

exports.apiResponseFilter = async apiResponseFile => {
  const fileContent = await storageService.getFileContent(apiResponseFile);
  console.log(`Downloaded file ${apiResponseFile.name}`);

  const { data, meta } = JSON.parse(fileContent);
  const dateToInclude = meta["3. Last Refreshed"].split(' ')[0]; // format = 2019-10-14 16:00:00

  const dailyEvents = Object
    .keys(data)
    .filter(key => key.includes(dateToInclude))
    .map(key => dataParsingService.parseMinuteEvent(key, data, meta));

  console.log(`Got ${dailyEvents.length} events for ${dateToInclude} in file ${apiResponseFile.name}`);

  const newFileName = `${apiResponseFile.name}l`;
  await storageService.saveJsonlData(newFileName, 'persistent-parsed-data', dailyEvents);
  console.log(`${dailyEvents.length} stored for ${newFileName}`);
};
