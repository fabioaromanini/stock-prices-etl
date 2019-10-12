const axios = require('axios');
const conf = require('../conf/env');

const { API_KEY, BASE_URL } = conf;

exports.dailyInfo = async symbol => {
  const { data } = await axios.get(
    BASE_URL
    + '?function=TIME_SERIES_INTRADAY&outputsize=full'
    + `&symbol=${symbol}&interval=1min&apikey=${API_KEY}`
  );
  
  data['Meta Data']['7. Request Timestamp'] = new Date().toISOString();

  return data;
};
