const AWS = require("../config/aws");
const rekognition = new AWS.Rekognition();

exports.detectLabels = async (imageUrl) => {
  // Extract the S3 key from the full URL
  const s3Key = imageUrl.split("/").slice(-2).join("/"); // Get "uploads/filename"
  
  console.log("S3 Key being used:", s3Key);
  console.log("Full S3 URL:", imageUrl);
  
  const params = {
    Image: {
      S3Object: {
        Bucket: process.env.S3_BUCKET_NAME,
        Name: s3Key
      }
    },
    MaxLabels: 5,
    MinConfidence: 70
  };

  const result = await rekognition.detectLabels(params).promise();

  return result.Labels.map(label => label.Name);
};