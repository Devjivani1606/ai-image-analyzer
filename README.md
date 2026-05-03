# 🚀 AI Image Analyzer (AWS + Next.js)

## 📌 Overview

A cloud-based application that analyzes images using AI and converts results into speech.

## ⚙️ Tech Stack

* Frontend: Next.js
* Backend: Node.js (Express)
* Cloud: AWS S3, Rekognition, Polly

## ✨ Features

* Upload single & multiple images
* Detect objects using AWS Rekognition
* Convert results to speech using AWS Polly
* Parallel processing using Promise.all()

## 🧠 Architecture

Frontend → Backend → S3 → Rekognition → Polly → Response

## 🚀 How to Run

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables

Create `.env` in backend:

```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your_bucket
```

## 📷 Demo

(Add screenshots here later)

## 📈 Future Improvements

* User authentication
* History dashboard (DynamoDB)
* Progress tracking
