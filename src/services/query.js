const queries = {
  minMax: require('../queries/minMax'),
  repeatedStockData: require('../queries/repeatedStockData')
}

exports.getQueryCreator = name => queries[name];