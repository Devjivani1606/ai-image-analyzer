const AWS = require("../config/aws");
const rekognition = new AWS.Rekognition();

exports.detectLabels = async (imageUrl) => {
  const params = {
    Image: {
      S3Object: {
        Bucket: process.env.S3_BUCKET_NAME,
        Name: imageUrl.split(".com/")[1]
      }
    },
    MaxLabels: 5,
    MinConfidence: 70
  };

  const result = await rekognition.detectLabels(params).promise();

  return result.Labels.map(label => label.Name);
};