# Serverless Stock Prices ETL

A serverless ETL pipeline for loading stock prices from [Alpha Vantage](https://www.alphavantage.co/) into [Google BigQuery](https://cloud.google.com/bigquery/).

![](static/etldiagram.png)

### Requirements

* conf/env.js file with the following content:
```javascript
module.exports = {
  API_KEY: "string"
}
```

* ~/.gcloud/keyfile.json as described [here](https://serverless.com/framework/docs/providers/google/guide/credentials/).

### Deploy

* Make sure that you have [node](https://nodejs.org/en/) installed and run the following commands:

```sh
npm install
npm run deploy
```

* Create a Cloud Scheduler event with the following expression: *\* 17,18 * * 1-5*, in *Eastern Daylight Time (EDT)*, that publishes a message in *stockSelectorTrigger*

### TO DO
* Parametrize (?) how many stocks are downloaded per stock selection
