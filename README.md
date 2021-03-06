# Stock Prices ETL

A serverless ETL pipeline for loading stock prices from [Alpha Vantage](https://www.alphavantage.co/) into [Google BigQuery](https://cloud.google.com/bigquery/).

![](static/etldiagram.png)

### Requirements

* conf/env.js file with an [alphavantage api key](https://www.alphavantage.co/documentation/):
```javascript
module.exports = {
  API_KEY: "string"
}
```

* ~/.gcloud/keyfile.json as described [here](https://serverless.com/framework/docs/providers/google/guide/credentials/).
* [node](https://nodejs.org/en/) >=  10.14.12

### Deploy

* Run the following commands in the root directory of the project:

```sh
npm install
npm run deploy
```

* Create a Cloud Scheduler job with the following expression: *\* 17,18 * * 1-5*, in *Eastern Daylight Time (EDT)*, that publishes a message in a pubsub topic named *stockSelectorTrigger*

* Throughout the pipeline execution, some extractions may fail because of the alphavantage API quota (5 requests per minute). To deal with this, you may also create an auxiliar Cloud Scheduler job
that will trigger the selector a few times after the first cloud scheduler job finished. This will assure that every stock is downloaded. *PS: if the selector runs and there is no remaining stocks to download, it will simply not trigger the pipeline*. 

### TO DO

* Refactor services into new services and connectors
* Refactor index.js logic into separate controllers
* Automatically create datamarts for stock symbols
* Rename bq tables to follow a name pattern
* Improve logging with custom lib (winston maybe)
* CI/CD
* ~~Improve parameter system~~
* ~~Update diagram with deduplication and dailyJobs~~
