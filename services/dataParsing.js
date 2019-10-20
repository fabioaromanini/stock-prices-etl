const moment = require('moment');

exports.parseMinuteEvent = (key, collection, meta) => {
  const [date, minutes] = key.split(' ');
  const element = collection[key];
  
  return {
    open: element['1. open'],
    high: element['2. high'],
    low: element['3. low'],
    close: element['4. close'],
    volume: element['5. volume'],
    symbol: meta['2. Symbol'],
    extracted_at: meta.timestamp,
    created_at: moment(), 
    date,
    minutes
  }
};