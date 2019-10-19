const { Storage } = require('@google-cloud/storage');

const client = new Storage();

exports.saveData = async (filename, bucket, content) => {
  const fullFilename = `${content.meta.date}/${filename}`;
  file = client.bucket(bucket).file(fullFilename);
  const parsedContent = JSON.stringify(content);
  await file.save(
    parsedContent, 
    { metadata: { contentType: 'application/json' } }
  );
};

exports.getFileContent = async (file) => {
  const bucketFile = await client
    .bucket(file.bucket)
    .file(file.name)
    .download();

  return bucketFile.toString();
};
