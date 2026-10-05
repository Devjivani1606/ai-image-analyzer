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
    MaxLabels: 10,
    MinConfidence: 60
  };

  const result = await rekognition.detectLabels(params).promise();

  const labels = result.Labels.map(label => label.Name);

  const objects = [];
  result.Labels.forEach(label => {
    if (label.Instances && label.Instances.length > 0) {
      label.Instances.forEach(instance => {
        if (instance.BoundingBox) {
          objects.push({
            name: label.Name,
            confidence: Math.round(instance.Confidence || label.Confidence),
            boundingBox: instance.BoundingBox // { Width, Height, Left, Top }
          });
        }
      });
    }
  });

  console.log(`Detected ${labels.length} labels and ${objects.length} bounding box objects`);

  return { labels, objects };
};