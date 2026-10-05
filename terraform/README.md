# 🛠️ Terraform Infrastructure for AI Image Analyzer

This folder contains complete, production-ready HashiCorp Terraform modules to provision all cloud infrastructure required by the **AI Image Analyzer** application on Amazon Web Services (AWS).

---

## 🏗️ Architecture Provisioned

1. **AWS S3 Bucket**: Stores uploaded user images with CORS enabled and public access policy.
2. **AWS DynamoDB Table**: Partition key (`pk`), Sort key (`sk`), pay-per-request mode for history logs.
3. **AWS IAM Policies & Roles**: 
   - Least-privilege IAM Policy (`s3`, `rekognition`, `polly`, `dynamodb`).
   - IAM Role and Instance Profile for EC2.
   - IAM Access Keys for local backend environment testing.
4. **Networking (VPC & Security Groups)**: Custom VPC, public subnet, internet gateway, route table, and security group allowing ports `80`, `3000` (Next.js), `5000` (Node.js API), and `22` (SSH).
5. **AWS EC2 Instance (Optional)**: Ubuntu 22.04 LTS web server with automated Node.js installation.

---

## 📋 Prerequisites

- [Terraform CLI](https://developer.hashicorp.com/terraform/downloads) (v1.3.0 or higher) installed.
- [AWS CLI](https://aws.amazon.com/cli/) installed and configured with credentials (`aws configure`).
- An active AWS account with permissions to create S3, DynamoDB, IAM, VPC, and EC2 resources.

---

## 🚀 Deployment Steps

### Step 1: Navigate to the Terraform Directory
```bash
cd terraform
```

### Step 2: Initialize Terraform
Download provider plugins and initialize working directory:
```bash
terraform init
```

### Step 3: Customize Variables (Optional)
Copy `terraform.tfvars.example` to `terraform.tfvars` and edit values if needed:
```bash
cp terraform.tfvars.example terraform.tfvars
```

### Step 4: Preview Provisioning Plan
Run a plan to review resources that will be created:
```bash
terraform plan
```

### Step 5: Apply & Provision Infrastructure
Apply the configuration to create all resources on AWS:
```bash
terraform apply
```
*(Type `yes` when prompted to confirm execution)*

---

## 🔌 Connecting Infrastructure to the Backend

Once `terraform apply` completes, Terraform outputs the exact configuration values for your `backend/.env` file.

Run the following command to retrieve the `.env` template values:
```bash
terraform output -raw backend_dotenv_template
```

Copy the output into `backend/.env`:
```env
AWS_ACCESS_KEY_ID=<Output Access Key ID>
AWS_SECRET_ACCESS_KEY=<Output Secret Key>
AWS_REGION=ap-south-1
S3_BUCKET_NAME=<Output S3 Bucket Name>
DYNAMODB_TABLE_NAME=ImageAnalysis
```

---

## 🧹 Destroying Infrastructure

To avoid ongoing charges on AWS, destroy all resources when finished:
```bash
terraform destroy
```
*(Type `yes` when prompted)*
