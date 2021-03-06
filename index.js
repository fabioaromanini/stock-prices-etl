'use strict'
const moment = require('moment-timezone');

const alphaVantageService = require('./src/services/alphaVantage');
const pubsubService = require('./src/services/pubsub');
const storageService = require('./src/services/storage');
const utilsService = require('./src/services/utils');
const bigqueryService = require('./src/services/bigquery');

const {
  RAW_STOCK_DATA_STORAGE,
  PARSED_STOCK_DATA_STORAGE,
  STOCK_PIPELINE_QUEUE_NAME,
  STOCK_BIGQUERY_DATASET_NAME,
  STOCK_BIGQUERY_TABLE_NAME,
  SIMULTANEOUS_STOCK_DOWNLOADS,
  DEDUPLICATED_STOCK_BIGQUERY_TABLE_NAME,
  STOCK_METADATA_BIGQUERY_DATASET_NAME,
  JOB_BIGQUERY_TABLE_NAME,
  ALL_STOCKS_BIGQUERY_TABLE_NAME
} = process.env;

moment.tz.setDefault('America/New_York');

exports.stockSelector = async () => {
  const currentDate = moment().format('YYYY-MM-DD');
  console.log(`Selecting stocks for date ${currentDate}`);
  const downloadedStockFiles = await storageService
    .getDirectoryFilenames(currentDate, RAW_STOCK_DATA_STORAGE);

  const downloadedStockNames = new Set(
    downloadedStockFiles
      .map(filename => filename.split('.')[0]) // filename example: AMZN.json
  );

  const stockList = await bigqueryService.getTableContent(
    STOCK_METADATA_BIGQUERY_DATASET_NAME,
    ALL_STOCKS_BIGQUERY_TABLE_NAME
  );
  const stocksToDownload = utilsService.getStocksToDownload(stockList, downloadedStockNames);
  const selectedStocks = stocksToDownload.slice(0, SIMULTANEOUS_STOCK_DOWNLOADS);
  console.log(`Triggering pipeline for stocks ${selectedStocks}`);

  const selectedStocksPromises = selectedStocks
    .map(
      stock => pubsubService.publishMessage(stock, STOCK_PIPELINE_QUEUE_NAME)
    );

  await Promise.all(selectedStocksPromises);
  console.log(`Triggered pipeline for stocks ${selectedStocks}. ${stocksToDownload.length - selectedStocks.length} stocks remaining`);
};

exports.extractStockData = async (event) => {
  const stock = pubsubService.parseMessage(event);
  const timestamp = moment();
  console.log(`Extracting data for ${stock} for date ${timestamp}`);
  try {
    const dailyInfoData = await alphaVantageService.dailyInfo(stock, timestamp);
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

  const timestamp = moment();
  if (timestamp.format('YYYY-MM-DD') !== dateToInclude) {
    console.log(`Latest stock prices for ${rawFile.name} are not today's. Aborting transform operation.`);
    return;
  }

  const dailyEvents = Object
    .keys(data)
    .filter(key => key.includes(dateToInclude))
    .map(key => utilsService.parseMinuteEvent(key, data, meta, timestamp));

  console.log(`Got ${dailyEvents.length} events for ${dateToInclude} in file ${rawFile.name}`);

  const newFileName = `${rawFile.name}l`;
  await storageService.saveJsonlData(newFileName, PARSED_STOCK_DATA_STORAGE, dailyEvents);
  console.log(`${dailyEvents.length} stored for ${newFileName}`);
};

exports.loadStockData = async parsedFile => {
  console.log(`Creating job for ${parsedFile.name} data load`);
  const source = storageService.getFileReference(parsedFile.bucket, parsedFile.name);
  await bigqueryService.loadJsonlData(source, STOCK_BIGQUERY_DATASET_NAME, STOCK_BIGQUERY_TABLE_NAME);
  console.log(`Job for ${parsedFile.name} created`);
};

exports.dailyJobsTrigger = async event => {
  const timestamp = moment();
  console.log(`Triggering daily jobs for ${timestamp}`);
  const dateToProcess = utilsService.getDateToProcess(timestamp, event);

  const jobList = await bigqueryService.getTableContent(
    STOCK_METADATA_BIGQUERY_DATASET_NAME,
    JOB_BIGQUERY_TABLE_NAME
  );

  const jobPromises = jobList.map(jobSettings => {
    const { name, query, destination_dataset, destination_table } = jobSettings;

    console.log(`Starting job ${name}`);

    const destinationTable = bigqueryService.getTable(
      destination_dataset,
      destination_table
    );

    const params = [{
      name: 'date',
      parameterType: { type: 'DATE' },
      parameterValue: { value: bigqueryService.createDateType(dateToProcess) } 
    }];
    return bigqueryService.createQueryJob(query, destinationTable, params);
  });

  await Promise.all(jobPromises);
  console.log(`All daily jobs for date ${dateToProcess} triggered`);
};

exports.deduplicationJobTrigger = async event => {
  const timestamp = moment();
  const dateToProcess = utilsService.getDateToProcess(timestamp, event);
  console.log(`Starting deduplication job for date ${dateToProcess}`);

  const destinationTable = bigqueryService
    .getTable(STOCK_BIGQUERY_DATASET_NAME, DEDUPLICATED_STOCK_BIGQUERY_TABLE_NAME);
  const query = utilsService.getDeduplicationQuery(dateToProcess);
  await bigqueryService.createQueryJob(query, destinationTable);
  console.log(`Deduplication job for date ${dateToProcess} triggered`);
};
