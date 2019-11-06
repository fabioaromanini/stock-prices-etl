const queries = {
  minMax: require('../queries/minMax')
}

exports.getQueryCreator = name => queries[name];