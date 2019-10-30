# Serverless Stock Prices ETL

A serverless ETL pipeline for loading stock prices from [Alpha Vantage](https://www.alphavantage.co/) into [Google BigQuery](https://cloud.google.com/bigquery/).

### DONE

##### Data Extraction
* Retrieve information for a given stock using pubsub messages
* Store information about a stock in a transient datalake

##### Data Transforming
* Filter daily stock prices and store it as jsonl in persistent datalake

##### Stock generalization
* Create in memory list of stocks
* Check downloaded stocks
* Select 4 that are not yet downloaded
* Trigger **stock pipeline** for each

### TO DO

##### Data loading
* Load parsed data into BigQuery
