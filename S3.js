const AWS = require("aws-sdk");
const keys = require("./config/keys");

function createBucket() {
  let s3Bucket = new AWS.S3({
    accessKeyId: keys.awsAccessKeyID,
    secretAccessKey: keys.awsSecretAccessKey,
    region: keys.awsRegion,
  });

  return s3Bucket;
}

module.exports = createBucket;
