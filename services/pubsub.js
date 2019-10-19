// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');

const client = new PubSub();

exports.publishMessage = async (message, topic) => {
  const dataBuffer = Buffer.from(message);
  return client.topic(topic).publish(dataBuffer);
}
