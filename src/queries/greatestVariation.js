module.exports = date => `WITH
  ranked_min AS (
  SELECT
    RANK() OVER (PARTITION BY symbol ORDER BY open, tick) rank,
    open,
    tick min_tick,
    symbol
  FROM
    \`etl-data-meetup.stock_dataset.deduplicated_stock_table\`
  WHERE
    date = "${date}" ),
  min AS (
  SELECT
    *
  FROM
    ranked_min
  WHERE
    rank = 1 ),
  ranked_max AS (
  SELECT
    RANK() OVER (PARTITION BY symbol ORDER BY close DESC, tick DESC) rank,
    close,
    tick max_tick,
    symbol
  FROM
    \`etl-data-meetup.stock_dataset.deduplicated_stock_table\`
  WHERE
    date = "${date}"),
  max AS (
  SELECT
    *
  FROM
    ranked_max
  WHERE
    rank = 1),
  joined AS (
  SELECT
    symbol,
    open,
    min_tick,
    close,
    max_tick
  FROM
    min
  JOIN
    max
  USING
    (symbol))
SELECT
  DATE('${date}') date,
  *,
IF
  (max_tick < min_tick,
    'DECRESCENT',
    'CRESCENT') sense,
  ABS(close - open) magnitude
FROM
  joined
`;
