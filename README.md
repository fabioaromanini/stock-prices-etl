# Serverless Stock Prices ETL

A serverless ETL pipeline for loading stock prices from [Alpha Vantage](https://www.alphavantage.co/) into [Google BigQuery](https://cloud.google.com/bigquery/).

### DONE

* Retrieve information for a given symbol
* Store information about a symbol in a transient datalake

### TO DO

* Parse transient datalake files into jsonl
* Group all daily files into a single jsonl
* Create tables in bigquery from jsonl
* Automatically retrieve information for a set of symbols daily
* Design a Cloud Dataflow pipeline for daily aggregations
