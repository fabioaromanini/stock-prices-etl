'use strict'
const alphaVantageService = require('./services/alphaVantage');

exports.dailyInfo = async (request, response) => {
  const data = await alphaVantageService.dailyInfo('MSFT');
  response.status(200).send(`${Object.keys(data).length} objects retrieved from API`);
};
