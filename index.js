'use strict'
const moment = require('moment');

const alphaVantageService = require('./services/alphaVantage');
const pubsubService = require('./services/pubsub');
const storageService = require('./services/storage');
const utilsService = require('./services/utils');

const {
  RAW_STOCK_DATA_STORAGE,
  PARSED_STOCK_DATA_STORAGE,
  STOCK_PIPELINE_QUEUE_NAME
} = process.env;

const stockList = require('./static/stockList');
const stockSet = new Set(stockList);

exports.stockSelector = async () => {
  const currentDirectory = moment().format('YYYY-MM-DD');
  const downloadedStockFiles = await storageService
    .getDirectoryFilenames(currentDirectory, RAW_STOCK_DATA_STORAGE);
  
  const downloadedStockNames = new Set(
    downloadedStockFiles
      .map(filename => filename.split('.')[0]) // filename example: AMZN.json
  );
  const stocksToDownload = utilsService.setDifference(stockSet, downloadedStockNames);
  const selectedStocks = stocksToDownload.slice(0, 4);
  console.log(`Triggering pipeline for stocks ${selectedStocks}`);

  const selectedStocksPromises = selectedStocks
    .map(
      stock => pubsubService.publishMessage(stock, STOCK_PIPELINE_QUEUE_NAME)
    )

  await Promise.all(selectedStocksPromises);
  console.log(`Triggered pipeline for stocks ${selectedStocks}`);
};

exports.extractStockData = async (event) => {
  const stock = pubsubService.parseMessage(event);
  console.log(`Extracting data for ${stock}`);
  try {
    const dailyInfoData = await alphaVantageService.dailyInfo(stock);
    const dataSize = dailyInfoData.meta.dataLenght;
    console.log(`${dataSize} objects retrieved from API for ${stock}`);

    await storageService.saveJsonData(`${stock}.json`, RAW_STOCK_DATA_STORAGE, dailyInfoData);
    console.log(`${dataSize} stored for ${stock}`);
  } catch (e) {
    console.error(`Failed to get stock data for ${stock}`);
  }
};

exports.transformStockData = async rawFile => {
  console.log(`Parsing ${rawFile.name} data`);
  const fileContent = await storageService.getFileContent(rawFile);
  console.log(`Downloaded file ${rawFile.name}`);

  const { data, meta } = JSON.parse(fileContent);
  const dateToInclude = meta['3. Last Refreshed'].split(' ')[0]; // format = 2019-10-14 16:00:00

  const dailyEvents = Object
    .keys(data)
    .filter(key => key.includes(dateToInclude))
    .map(key => utilsService.parseMinuteEvent(key, data, meta));

  console.log(`Got ${dailyEvents.length} events for ${dateToInclude} in file ${rawFile.name}`);

  const newFileName = `${rawFile.name}l`;
  await storageService.saveJsonlData(newFileName, PARSED_STOCK_DATA_STORAGE, dailyEvents);
  console.log(`${dailyEvents.length} stored for ${newFileName}`);
};

exports.loadStockData = async parsedFile => {
  console.log(`Parsing ${parsedFile.name} data`);
};
