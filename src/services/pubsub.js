// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
const atob = require('atob');

const client = new PubSub();

exports.publishMessage = async (message, topic) => {
  const dataBuffer = Buffer.from(message);
  return client.topic(topic).publish(dataBuffer);
}

exports.parseMessage = message => atob(message.data);
