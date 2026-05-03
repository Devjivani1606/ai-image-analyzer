const AWS = require("../config/aws");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const polly = new AWS.Polly();

exports.textToSpeech = async (text) => {
  const params = {
    OutputFormat: "mp3",
    Text: text,
    VoiceId: "Joanna"
  };

  const data = await polly.synthesizeSpeech(params).promise();

  const fileName = `audio-${uuidv4()}.mp3`;
  const filePath = path.join(__dirname, "../", fileName);

  fs.writeFileSync(filePath, data.AudioStream);

  return fileName;
};