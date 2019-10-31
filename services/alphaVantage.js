const axios = require('axios');
const conf = require('../conf/env');

const { API_KEY } = conf;

const { BASE_URL } = process.env;

exports.dailyInfo = async (symbol, timestamp) => {
  const { data: apiResponseData } = await axios.get(
    BASE_URL
    + '?function=TIME_SERIES_INTRADAY&outputsize=full'
    + `&symbol=${symbol}&interval=1min&apikey=${API_KEY}`
  );

  return {
    data: apiResponseData['Time Series (1min)'],
    meta: {
      ...apiResponseData['Meta Data'],
      timestamp: timestamp,
      date: timestamp.format('YYYY-MM-DD'),
      dataLenght: Object.keys(apiResponseData['Time Series (1min)']).length
    }
  };
};
