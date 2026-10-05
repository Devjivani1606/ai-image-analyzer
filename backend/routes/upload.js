const express = require("express");
const multer = require("multer");

const { uploadFile } = require("../services/s3services");
const { detectLabels } = require("../services/rekognitionService");
const { textToSpeech } = require("../services/pollyService");
const { saveResult, getHistory } = require("../services/dynamoService");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        let dbSaved = false;
        let dbError = null;

        // 1. Upload to S3
        const imageUrl = await uploadFile(file);

        // 2. Detect labels and bounding box objects
        const { labels, objects } = await detectLabels(imageUrl);

        // 3. Save to DynamoDB
        try {
          await saveResult({ imageUrl, labels });
          dbSaved = true;
        } catch (error) {
          dbError = error.message;
          console.error("DynamoDB save failed:", error);
        }

        // 4. Convert to English sentence for speech
        const textToSay = labels.length > 0 
          ? `This image contains: ${labels.slice(0, 5).join(", ")}.`
          : "No specific objects were detected in this image.";

        // 5. Convert to speech via AWS Polly
        const audioFile = await textToSpeech(textToSay);

        return {
          imageUrl,
          labels,
          objects,
          audioUrl: `http://localhost:5000/${audioFile}`,
          dbSaved,
          dbError
        };
      })
    );

    res.json(results);

  } catch (err) {
    console.error("Upload route error:", err);
    res.status(500).json({
      error: "Something went wrong",
      message: err.message
    });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await getHistory(req.query.userId);
    res.json(history);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Could not load history" });
  }
});

module.exports = router;
