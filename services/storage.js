const { Storage } = require('@google-cloud/storage');

const client = new Storage();

exports.saveJsonData = async (filename, bucket, content) => {
  const fullFilename = `${content.meta.date}/${filename}`;
  const file = client.bucket(bucket).file(fullFilename);
  const parsedContent = JSON.stringify(content);
  await file.save(
    parsedContent,
    { metadata: { contentType: 'application/json' } }
  );
};

exports.saveJsonlData = async (filename, bucket, content) => {
  const file = client.bucket(bucket).file(filename);

  const parsedContent = content
    .map(element => JSON.stringify(element))
    .reduce((prev, curr) => `${prev}${curr}\n`, '');

  await file.save(
    parsedContent,
    { metadata: { contentType: 'application/x-ndjson' } }
  );
};

exports.getFileContent = async (file) => {
  const bucketFile = await client
    .bucket(file.bucket)
    .file(file.name)
    .download();

  return bucketFile.toString();
};

exports.getDirectoryFilenames = async (directory, bucket) => {
  const [files] = await client.bucket(bucket).getFiles({ directory: directory });
  return files
    .map(file => file.name)
    .map(filename => filename.split('/')[1]) // filaname example: '2019-05-22/AMZN.json'
};

exports.getFileReference = (bucket, name) => {
  return client.bucket(bucket).file(name);
};
