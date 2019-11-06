module.exports = date => `SELECT
  DATE('${date}') date,
  (
  SELECT
    AS STRUCT symbol,
    open
  FROM
    \`etl-data-meetup.stock_dataset.stock_table\`
  WHERE
    date = '${date}'
  ORDER BY
    tick,
    open
  LIMIT
    1) lowest_open,
  (
  SELECT
    AS STRUCT symbol,
    open
  FROM
    \`etl-data-meetup.stock_dataset.stock_table\`
  WHERE
    date = '${date}'
  ORDER BY
    tick,
    open DESC
  LIMIT
    1) highest_open,
      (
  SELECT
    AS STRUCT symbol,
    close
  FROM
    \`etl-data-meetup.stock_dataset.stock_table\`
  WHERE
    date = '${date}'
  ORDER BY
    tick DESC,
    close
  LIMIT
    1) lowest_close,
    (
  SELECT
    AS STRUCT symbol,
    close
  FROM
    \`etl-data-meetup.stock_dataset.stock_table\`
  WHERE
    date = '${date}'
  ORDER BY
    tick DESC,
    close DESC
  LIMIT
    1) highest_close,
    (
  SELECT
    AS STRUCT symbol,
    high,
    tick
  FROM
    \`etl-data-meetup.stock_dataset.stock_table\`
  WHERE
    date = '${date}'
  ORDER BY
    high DESC
  LIMIT
    1) highest_overall,
    (
  SELECT
    AS STRUCT symbol,
    low,
    tick
  FROM
    \`etl-data-meetup.stock_dataset.stock_table\`
  WHERE
    date = '${date}'
  ORDER BY
    low
  LIMIT
    1) lowest_overall
`