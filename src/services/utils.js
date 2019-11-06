exports.parseMinuteEvent = (key, collection, meta, timestamp) => {
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
    transformed_at: timestamp, 
    tick: minutes,
    date
  }
};

exports.setDifference = (left, right) => {
  const diff = [];

  left.forEach(entry => {
    if (!right.has(entry)) {
      diff.push(entry);
    }
  })

  return diff;
};