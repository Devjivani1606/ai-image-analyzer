# S3 Bucket for Uploaded Images
resource "aws_s3_bucket" "image_storage" {
  bucket        = "${var.project_name}-bucket-${random_id.suffix.hex}"
  force_destroy = true
}

# Ownership controls
resource "aws_s3_bucket_ownership_controls" "image_storage" {
  bucket = aws_s3_bucket.image_storage.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# Public access block settings
resource "aws_s3_bucket_public_access_block" "image_storage" {
  bucket = aws_s3_bucket.image_storage.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 CORS Configuration for Frontend access
resource "aws_s3_bucket_cors_configuration" "image_storage" {
  bucket = aws_s3_bucket.image_storage.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# S3 Bucket Policy allowing Public Read Access for uploaded images
resource "aws_s3_bucket_policy" "allow_public_read" {
  depends_on = [aws_s3_bucket_public_access_block.image_storage]
  bucket     = aws_s3_bucket.image_storage.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.image_storage.arn}/*"
      }
    ]
  })
}
