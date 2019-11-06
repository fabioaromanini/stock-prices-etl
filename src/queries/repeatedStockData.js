module.exports = date => `SELECT
  DISTINCT DATE('${date}') date,
  repetitions,
  symbol
FROM (
  SELECT
    COUNT(tick) repetitions,
    symbol,
    tick
  FROM
    \`etl-data-meetup.stock_dataset.stock_table\`
  WHERE
    date = '${date}'
  GROUP BY
    symbol,
    tick
  HAVING
    repetitions > 1 )
`;
