output "aws_region" {
  description = "Configured AWS Region"
  value       = var.aws_region
}

output "s3_bucket_name" {
  description = "Name of the created S3 bucket"
  value       = aws_s3_bucket.image_storage.id
}

output "s3_bucket_arn" {
  description = "ARN of the created S3 bucket"
  value       = aws_s3_bucket.image_storage.arn
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  value       = aws_dynamodb_table.image_analysis.name
}

output "ec2_public_ip" {
  description = "Public IP address of the backend/frontend EC2 instance"
  value       = length(aws_instance.app_server) > 0 ? aws_instance.app_server[0].public_ip : "EC2 deployment disabled"
}

output "ec2_public_dns" {
  description = "Public DNS of the backend/frontend EC2 instance"
  value       = length(aws_instance.app_server) > 0 ? aws_instance.app_server[0].public_dns : "EC2 deployment disabled"
}

output "iam_user_access_key_id" {
  description = "IAM User Access Key ID (Use for local backend testing)"
  value       = aws_iam_access_key.app_user_key.id
}

output "iam_user_secret_access_key" {
  description = "IAM User Secret Access Key (Use for local backend testing)"
  value       = aws_iam_access_key.app_user_key.secret
  sensitive   = true
}

output "backend_dotenv_template" {
  description = "Generated backend .env environment configuration content"
  sensitive   = true
  value       = <<EOT
AWS_ACCESS_KEY_ID=${aws_iam_access_key.app_user_key.id}
AWS_SECRET_ACCESS_KEY=${aws_iam_access_key.app_user_key.secret}
AWS_REGION=${var.aws_region}
S3_BUCKET_NAME=${aws_s3_bucket.image_storage.id}
DYNAMODB_TABLE_NAME=${aws_dynamodb_table.image_analysis.name}
EOT
}
