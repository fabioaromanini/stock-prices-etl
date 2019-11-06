const { BigQuery } = require('@google-cloud/bigquery');

const client = new BigQuery();

exports.loadJsonlData = async (source, dataset, table) => {
  const tableRef = client.dataset(dataset).table(table);
  return tableRef.createLoadJob(
    source,
    { sourceFormat: 'NEWLINE_DELIMITED_JSON' }
  );
};

exports.getTable = async (dataset, table) => {
  const datasetRef = await client.dataset(dataset).get({
    autoCreate: true
  });

  return datasetRef[0].table(table);
};

exports.createQueryJob = (query, destination) => client.createQueryJob({
  createDisposition: 'CREATE_IF_NEEDED',
  writeDisposition: 'WRITE_APPEND',
  timePartitioning: {
    type: 'DAY',
    field: 'date'
  },
  priority: 'BATCH',
  destination,
  query
});
