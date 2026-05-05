const AWS = require("../config/aws");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3();

exports.uploadFile = async (file) => {
  try {
    console.log("Starting S3 upload for:", file.originalname);
    console.log("S3 Bucket:", process.env.S3_BUCKET_NAME);
    
    const fileContent = fs.readFileSync(file.path);
    
    const key = `uploads/${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: file.mimetype
    };

    console.log("S3 upload params:", { Bucket: params.Bucket, Key: params.Key });

    const data = await s3.upload(params).promise();
    
    console.log("S3 upload successful:", data.Location);
    
    // Clean up the temporary file
    fs.unlinkSync(file.path);
    
    return data.Location;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    // Clean up the temporary file even if upload fails
    try {
      fs.unlinkSync(file.path);
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
    throw error;
  }
};