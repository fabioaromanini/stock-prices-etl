const axios = require('axios');
const moment = require('moment');
const conf = require('../conf/env');

const { API_KEY, BASE_URL } = conf;

exports.dailyInfo = async symbol => {
  const { data: apiResponseData } = await axios.get(
    BASE_URL
    + '?function=TIME_SERIES_INTRADAY&outputsize=full'
    + `&symbol=${symbol}&interval=1min&apikey=${API_KEY}`
  );

  const meta = apiResponseData['Meta Data'];
  const data = apiResponseData['Time Series (1min)'];

  const timestamp = moment();
  meta.timestamp = timestamp;
  meta.date = timestamp.format('YYYY-MM-DD');
  meta.dataLenght = Object.keys(data).length;

  return {
    data: data,
    meta: meta
  };
};
