const pubsubService = require('./pubsub');

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

exports.getDateToProcess = (timestamp, event) => {
  const eventMessage = pubsubService.parseMessage(event);
  // if the function is triggered by cloud scheduler, the event message will be '-'.
  // otherwise, if the function is triggered by another kind of event, it will use it's message as date
  return eventMessage !== '-' ? eventMessage : timestamp.format('YYYY-MM-DD');
}

exports.getDeduplicationQuery = date => `SELECT
  date,
  tick,
  symbol,
  open,
  close,
  low,
  high,
  volume,
  extracted_at,
  transformed_at
FROM (
  SELECT
    *,
    ROW_NUMBER() OVER(PARTITION BY symbol, tick) row_number
  FROM
    \`etl-data-meetup.stock_dataset.stock_table\`
  WHERE
    date = '${date}')
WHERE
  row_number = 1
`;
