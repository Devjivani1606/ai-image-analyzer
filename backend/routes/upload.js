const express = require("express");
const multer = require("multer");

const { uploadFile } = require("../services/s3services");
const { detectLabels } = require("../services/rekognitionService");
const { textToSpeech } = require("../services/pollyService");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const results = [];

    for (const file of files) {
      // 1. Upload to S3
      const imageUrl = await uploadFile(file);

      // 2. Detect labels
      const labels = await detectLabels(imageUrl);

      // 3. Convert to sentence
      const text = `This image contains: ${labels.join(", ")}`;

      // 4. Convert to speech
      const audioFile = await textToSpeech(text);

      results.push({
        imageUrl,
        labels,
        audioUrl: `http://localhost:5000/${audioFile}`
      });
    }

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;