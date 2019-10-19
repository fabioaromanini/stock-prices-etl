# Serverless Stock Prices ETL

A serverless ETL pipeline for loading stock prices from [Alpha Vantage](https://www.alphavantage.co/) into [Google BigQuery](https://cloud.google.com/bigquery/).

### DONE

* Retrieve information for a given symbol using pubsub messages
* Store information about a symbol in a transient datalake

### TO DO

##### Single symbol pipeline
* Filter daily stock prices and store it as jsonl in persistent datalake
* Aggregate data around hours and day, and stream data into bigquery

##### Symbol generalization
* Create in memory list of stocks
* Check downloaded stocks
* Select 4 that are not yet downloaded
* Trigger **single symbol pipeline** for each
