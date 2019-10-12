const { Storage } = require('@google-cloud/storage');

const client = new Storage();

exports.uploadJsObject = async (filename, bucket, content) => {
  file = client.bucket(bucket).file(filename);
  const parsedContent = JSON.stringify(content);
  await file.save(parsedContent, {
    metadata: {
      contentType: 'application/json'
    }
  });
};
