const { Storage } = require('@google-cloud/storage');

const client = new Storage();

exports.saveData = async (filename, bucket, content) => {
  const fullFileName = new Date()
  file = client.bucket(bucket).file(filename);
  const parsedContent = JSON.stringify(content);
  await file.save(parsedContent, {
    metadata: {
      contentType: 'application/json'
    }
  });
};
