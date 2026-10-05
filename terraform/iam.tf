# IAM Policy defining exact permissions for S3, Rekognition, Polly & DynamoDB
resource "aws_iam_policy" "backend_app_policy" {
  name        = "${var.project_name}-backend-policy-${random_id.suffix.hex}"
  description = "IAM policy granting permissions for AI Image Analyzer app (S3, Rekognition, Polly, DynamoDB)"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3Access"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Resource = [
          aws_s3_bucket.image_storage.arn,
          "${aws_s3_bucket.image_storage.arn}/*"
        ]
      },
      {
        Sid    = "RekognitionAccess"
        Effect = "Allow"
        Action = [
          "rekognition:DetectLabels",
          "rekognition:DetectFaces",
          "rekognition:DetectText"
        ]
        Resource = "*"
      },
      {
        Sid    = "PollyAccess"
        Effect = "Allow"
        Action = [
          "polly:SynthesizeSpeech"
        ]
        Resource = "*"
      },
      {
        Sid    = "DynamoDBAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          aws_dynamodb_table.image_analysis.arn
        ]
      }
    ]
  })
}

# IAM Role for EC2 Instance (Allows server to interact with AWS services securely without hardcoding secrets)
resource "aws_iam_role" "ec2_backend_role" {
  name = "${var.project_name}-ec2-role-${random_id.suffix.hex}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_backend_attach" {
  role       = aws_iam_role.ec2_backend_role.name
  policy_arn = aws_iam_policy.backend_app_policy.arn
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "${var.project_name}-ec2-profile-${random_id.suffix.hex}"
  role = aws_iam_role.ec2_backend_role.name
}

# Optional IAM User for Local Development / Non-EC2 deployments
resource "aws_iam_user" "app_user" {
  name = "${var.project_name}-app-user-${random_id.suffix.hex}"
}

resource "aws_iam_user_policy_attachment" "app_user_attach" {
  user       = aws_iam_user.app_user.name
  policy_arn = aws_iam_policy.backend_app_policy.arn
}

resource "aws_iam_access_key" "app_user_key" {
  user = aws_iam_user.app_user.name
}
