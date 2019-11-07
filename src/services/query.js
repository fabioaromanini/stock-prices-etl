const queries = {
  minMax: require('../queries/minMax'),
  repeatedStockData: require('../queries/repeatedStockData'),
  deduplication: require('../queries/deduplication'),
  greatestVariation: require('../queries/greatestVariation')
}

exports.getQueryCreator = name => queries[name];
