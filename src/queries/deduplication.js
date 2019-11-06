module.exports = date => `SELECT
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
