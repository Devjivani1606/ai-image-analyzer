const AWS = require("../config/aws");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3();

exports.uploadFile = async (file) => {
  const fileContent = fs.readFileSync(file.path);
  
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${uuidv4()}-${file.originalname}`,
    Body: fileContent,
    ContentType: file.mimetype
  };

  const data = await s3.upload(params).promise();
  
  // Clean up the temporary file
  fs.unlinkSync(file.path);
  
  return data.Location;
};