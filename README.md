# 🚀 AI Image Vision & Voice Analyzer (AWS + Next.js + Terraform)

A full-stack, cloud-native application that performs automated **AI Image Object Detection**, **Visual Bounding Box Highlighting**, **Text-to-Speech Generation**, and **Cloud History Storage** using Amazon Web Services (AWS) and Next.js.

---

## 📌 Project Summary

The **AI Image Vision & Voice Analyzer** allows users to upload single or multiple images through a minimal web interface. Upon uploading:
1. **Cloud Image Storage**: Images are stored in an **AWS S3 Bucket**.
2. **AI Computer Vision**: **AWS Rekognition** scans the image to detect objects, labels, and 2D bounding box spatial coordinates.
3. **Visual Object Highlighting**: The application draws **White Square Brackets** around every detected physical object on top of the image.
4. **Natural AI Speech Generation**: **AWS Polly** converts the detected labels into spoken English descriptions (`.mp3`).
5. **NoSQL History Storage**: Metadata (User ID, image URL, detected labels, timestamp) is logged in an **AWS DynamoDB Table**.
6. **Infrastructure as Code (IaC)**: All cloud resources are fully provisioned and managed via **HashiCorp Terraform**.

---

## ✨ Features Implemented

* 🖼️ **Image Drag & Drop & Local Previews**: Select multiple images with instant local thumbnails before uploading.
* 🔲 **White Square Bracket Bounding Box Overlays**: Real-time 2D bounding box visual highlighting over detected objects on the image.
* 🔊 **AWS Polly English Speech Synthesis**: Automatic natural English audio narration describing the image contents.
* 🗄️ **AWS DynamoDB History Logging**: Persistent serverless history logs storing analysis metadata.
* ⚡ **Parallel Async Processing**: High-throughput multi-image processing using Node.js `Promise.all()`.
* 🌿 **Minimalist & Responsive UI**: Clean, light, modern user interface built with Next.js and Tailwind CSS.
* 🏗️ **Complete Infrastructure as Code**: Single-command cloud provisioning with Terraform (`s3`, `dynamodb`, `iam`, `vpc`, `ec2`).

---

## 🧠 System Architecture

```mermaid
graph TD
    User([User / Browser]) -->|1. Upload Image| Frontend[Next.js App - Port 3000]
    Frontend -->|2. POST /upload| Backend[Node.js Express API - Port 5000]
    
    subgraph AWS Cloud Infrastructure (Provisioned via Terraform)
        Backend -->|3. Store Raw Image| S3[AWS S3 Bucket]
        Backend -->|4. Detect Labels & Bounding Boxes| Rekognition[AWS Rekognition]
        Backend -->|5. Synthesize English Audio| Polly[AWS Polly]
        Backend -->|6. Log Analysis Metadata| DynamoDB[AWS DynamoDB Table]
    end
    
    Backend -->|7. Return Image URL, White Brackets & Audio| Frontend
    Frontend -->|8. Render Image + White Brackets + Audio Speech| User
```

---

## ⚙️ Tech Stack & Services

* **Frontend**: Next.js 16 (React 19, TypeScript, Tailwind CSS)
* **Backend**: Node.js & Express.js
* **Cloud Infrastructure (AWS)**:
  * **AWS S3**: Image Object Storage
  * **AWS Rekognition**: AI Image Label & Bounding Box Detection
  * **AWS Polly**: AI Text-to-Speech Engine
  * **AWS DynamoDB**: NoSQL Database for History Records
* **Infrastructure as Code**: HashiCorp Terraform (`>= 1.3.0`)

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18 or higher) installed.
- AWS Credentials configured or Terraform installed.

---

### Step 1: Provision AWS Cloud Infrastructure (Terraform)

```bash
cd terraform
terraform init
terraform apply
```

To view the generated environment configuration for your backend:
```bash
terraform output -raw backend_dotenv_template
```

---

### Step 2: Run the Backend API

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create `.env` file with your AWS credentials:
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=ap-south-1
   S3_BUCKET_NAME=your_s3_bucket_name
   DYNAMODB_TABLE_NAME=ImageAnalysis
   ```
3. Install dependencies and start server:
   ```bash
   npm install
   npm start
   ```
   *Backend runs on `http://localhost:5000`*

---

### Step 3: Run the Frontend Web App

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies and run dev server:
   ```bash
   npm install
   npm run dev
   ```
   *Frontend runs on `http://localhost:3000`*

---

## 📡 API Endpoints

### `POST /upload`
- **Description**: Uploads up to 10 images, detects objects/labels, generates speech audio, and logs to DynamoDB.
- **Content-Type**: `multipart/form-data`
- **Body**: `images` (File array)
- **Response**:
  ```json
  [
    {
      "imageUrl": "https://s3.ap-south-1.amazonaws.com/bucket/uploads/filename.jpg",
      "labels": ["Person", "Tree", "Outdoor"],
      "objects": [
        {
          "name": "Person",
          "confidence": 99,
          "boundingBox": { "Width": 0.25, "Height": 0.50, "Left": 0.10, "Top": 0.20 }
        }
      ],
      "audioUrl": "http://localhost:5000/audio-uuid.mp3",
      "dbSaved": true
    }
  ]
  ```

### `GET /upload/history`
- **Description**: Retrieves image analysis history from AWS DynamoDB.
- **Query Parameter**: `userId` (Optional, defaults to `demo-user`).

---

## 📁 Repository Directory Structure

```text
ai-image-analyzer/
├── backend/                  # Node.js & Express API Server
│   ├── config/aws.js         # AWS SDK Configuration
│   ├── routes/upload.js      # Image Upload & Analysis Route
│   ├── services/             # AWS S3, Rekognition, Polly, DynamoDB Services
│   ├── server.js             # Entry Point
│   └── package.json
├── frontend/                 # Next.js Web Application
│   ├── app/                  # App Router & Minimalist UI (page.tsx)
│   ├── package.json
│   └── tsconfig.json
└── terraform/                # Infrastructure as Code (AWS Modules)
    ├── main.tf               # Provider setup
    ├── s3.tf                 # AWS S3 Bucket & CORS
    ├── dynamodb.tf           # AWS DynamoDB Table
    ├── iam.tf                # IAM Policies & Keys
    ├── vpc.tf                # VPC & Security Groups
    ├── ec2.tf                # Optional EC2 Hosting
    ├── outputs.tf            # Deployment Outputs & .env Generator
    └── README.md
```
