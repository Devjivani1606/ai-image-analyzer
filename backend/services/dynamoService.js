const AWS = require("../config/aws");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || process.env.DYNAMO_TABLE || "ImageAnalysis";
const DEFAULT_USER_ID = "demo-user";

exports.saveResult = async ({ userId = DEFAULT_USER_ID, imageUrl, labels }) => {
  try {
    const createdAt = new Date().toISOString();
    const params = {
      TableName: TABLE_NAME,
      Item: {
        pk: userId,
        sk: createdAt,
        userId,
        createdAt,
        imageUrl,
        labels
      }
    };

    console.log("DynamoDB params:", params);

    await dynamoDB.put(params).promise();

    console.log("Saved successfully ");

  } catch (error) {
    console.error("DynamoDB ERROR :", error);
    throw error;
  }
};

exports.getHistory = async (userId = DEFAULT_USER_ID) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": userId
      },
      ScanIndexForward: false // latest first
    };

    const data = await dynamoDB.query(params).promise();
    return data.Items || [];

  } catch (error) {
    console.error("DynamoDB History ERROR :", error);
    throw error;
  }
};
