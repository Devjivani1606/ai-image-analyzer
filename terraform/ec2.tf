# Fetch latest Ubuntu 22.04 LTS AMI automatically
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# EC2 Instance for deployment (controlled by var.enable_ec2_deployment)
resource "aws_instance" "app_server" {
  count                  = var.enable_ec2_deployment ? 1 : 0
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_instance_profile.name
  key_name               = var.ssh_key_name != "" ? var.ssh_key_name : null

  user_data = <<-EOF
              #!/bin/bash
              set -e
              apt-get update -y
              apt-get install -y curl git build-essential

              # Install Node.js 18.x LTS
              curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
              apt-get install -y nodejs pm2

              # Create app directory
              mkdir -p /opt/ai-image-analyzer
              
              # Set system environment variables
              echo "AWS_REGION=${var.aws_region}" >> /etc/environment
              echo "S3_BUCKET_NAME=${aws_s3_bucket.image_storage.id}" >> /etc/environment
              echo "DYNAMODB_TABLE_NAME=${aws_dynamodb_table.image_analysis.name}" >> /etc/environment

              echo "AI Image Analyzer server setup completed."
              EOF

  tags = {
    Name = "${var.project_name}-server"
  }
}
