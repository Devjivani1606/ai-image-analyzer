variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name tag and naming prefix"
  type        = string
  default     = "ai-image-analyzer"
}

variable "environment" {
  description = "Environment stage (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table for image analysis history"
  type        = string
  default     = "ImageAnalysis"
}

variable "vpc_cidr" {
  description = "CIDR block for the custom VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "EC2 instance type for application hosting"
  type        = string
  default     = "t3.micro"
}

variable "ssh_key_name" {
  description = "Optional EC2 SSH Key Pair name for instance access"
  type        = string
  default     = ""
}

variable "enable_ec2_deployment" {
  description = "Set to true to provision EC2 instance for hosting backend & frontend"
  type        = bool
  default     = true
}
