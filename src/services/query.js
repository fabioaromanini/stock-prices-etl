const queries = {
  minMax: require('../queries/minMax'),
  repeatedStockData: require('../queries/repeatedStockData'),
  deduplication: require('../queries/deduplication')
}

exports.getQueryCreator = name => queries[name];
