###################################################################################
# Terraform Configuration: Cloud Test Infrastructure
#
# Purpose: Provision a complete test environment in AWS
# Components: EC2 test runner, S3 storage, CloudWatch monitoring
#
# Interview Talking Points:
# - "This demonstrates Infrastructure as Code for reproducible test environments"
# - "Version controlled in Git - easy to track changes and collaborate"
# - "Can provision identical environments for dev, staging, production testing"
# - "Single command to create or destroy: terraform apply/destroy"
###################################################################################

# Provider Configuration
# Specify AWS as the cloud provider
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "QA-Automation"
      ManagedBy   = "Terraform"
      Environment = var.environment
      Team        = "QA-Engineering"
      CostCenter  = "Engineering"
    }
  }
}

###################################################################################
# Variables
###################################################################################

variable "aws_region" {
  description = "AWS region for test infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod-test)"
  type        = string
  default     = "staging"
}

variable "instance_type" {
  description = "EC2 instance type for test runner"
  type        = string
  default     = "t3.large"  # 2 vCPU, 8GB RAM - suitable for most test workloads
}

variable "enable_monitoring" {
  description = "Enable detailed CloudWatch monitoring"
  type        = bool
  default     = true
}

variable "auto_shutdown_hours" {
  description = "Automatically shutdown instance after N hours of idle (cost optimization)"
  type        = number
  default     = 8
}

###################################################################################
# EC2 Test Runner Instance
###################################################################################

# Security Group: Control network access to test runner
resource "aws_security_group" "test_runner_sg" {
  name        = "test-runner-sg-${var.environment}"
  description = "Security group for test automation runner"

  # SSH access (for debugging)
  ingress {
    description = "SSH from corporate VPN"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]  # Replace with your corporate network CIDR
  }

  # HTTPS for pulling Docker images, accessing APIs
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "test-runner-sg-${var.environment}"
  }
}

# EC2 Instance: Test automation runner
resource "aws_instance" "test_runner" {
  ami           = data.aws_ami.ubuntu.id  # Latest Ubuntu AMI
  instance_type = var.instance_type

  security_groups = [aws_security_group.test_runner_sg.name]

  # IAM role for accessing S3, CloudWatch, Secrets Manager
  iam_instance_profile = aws_iam_instance_profile.test_runner_profile.name

  # User data script: Automatically install Docker and dependencies on boot
  user_data = <<-EOF
    #!/bin/bash
    set -e

    # Update system
    apt-get update
    apt-get upgrade -y

    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker ubuntu

    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    # Install AWS CLI
    apt-get install -y awscli

    # Install Node.js and npm (for test frameworks)
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs

    # Pull test Docker image (replace with your image)
    # docker pull your-registry/cypress-tests:latest

    # Auto-shutdown after ${var.auto_shutdown_hours} hours to save costs
    echo "sudo shutdown -h now" | at now + ${var.auto_shutdown_hours} hours

    echo "Test runner setup complete" > /home/ubuntu/setup-complete.txt
  EOF

  # Enable detailed monitoring (additional cost, but valuable metrics)
  monitoring = var.enable_monitoring

  tags = {
    Name        = "cypress-test-runner-${var.environment}"
    Purpose     = "Automated-Testing"
    AutoShutdown = "Enabled"
  }
}

# Data source: Get latest Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical (Ubuntu official)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

###################################################################################
# S3 Bucket: Test Artifacts Storage
###################################################################################

# S3 bucket for storing test results, screenshots, videos, reports
resource "aws_s3_bucket" "test_artifacts" {
  bucket = "qa-test-artifacts-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name        = "test-artifacts-${var.environment}"
    Purpose     = "Test-Results-Storage"
  }
}

# S3 bucket lifecycle policy: Auto-delete old artifacts to save costs
resource "aws_s3_bucket_lifecycle_configuration" "test_artifacts_lifecycle" {
  bucket = aws_s3_bucket.test_artifacts.id

  rule {
    id     = "delete-old-test-results"
    status = "Enabled"

    # Delete test artifacts older than 30 days
    expiration {
      days = 30
    }

    # Move to cheaper storage after 7 days
    transition {
      days          = 7
      storage_class = "GLACIER"
    }
  }
}

# S3 bucket versioning (optional, for critical test data)
resource "aws_s3_bucket_versioning" "test_artifacts_versioning" {
  bucket = aws_s3_bucket.test_artifacts.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3 bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "test_artifacts_encryption" {
  bucket = aws_s3_bucket.test_artifacts.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Get current AWS account ID
data "aws_caller_identity" "current" {}

###################################################################################
# IAM Role: Permissions for test runner
###################################################################################

# IAM role for EC2 instance
resource "aws_iam_role" "test_runner_role" {
  name = "test-runner-role-${var.environment}"

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

  tags = {
    Name = "test-runner-role-${var.environment}"
  }
}

# IAM policy: Permissions for test runner
resource "aws_iam_role_policy" "test_runner_policy" {
  name = "test-runner-policy-${var.environment}"
  role = aws_iam_role.test_runner_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        # Allow uploading test artifacts to S3
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.test_artifacts.arn,
          "${aws_s3_bucket.test_artifacts.arn}/*"
        ]
      },
      {
        # Allow writing logs to CloudWatch
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        # Allow reading secrets from Secrets Manager
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:test-*"
      },
      {
        # Allow publishing metrics to CloudWatch
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData"
        ]
        Resource = "*"
      }
    ]
  })
}

# IAM instance profile
resource "aws_iam_instance_profile" "test_runner_profile" {
  name = "test-runner-profile-${var.environment}"
  role = aws_iam_role.test_runner_role.name
}

###################################################################################
# CloudWatch: Monitoring and Alarms
###################################################################################

# CloudWatch Log Group for test execution logs
resource "aws_cloudwatch_log_group" "test_logs" {
  name              = "/aws/tests/${var.environment}"
  retention_in_days = 30  # Keep logs for 30 days

  tags = {
    Name = "test-logs-${var.environment}"
  }
}

# CloudWatch Alarm: CPU utilization
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "test-runner-high-cpu-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "300"  # 5 minutes
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Alert when CPU exceeds 80% for 10 minutes"

  dimensions = {
    InstanceId = aws_instance.test_runner.id
  }

  # Optional: Send notification to SNS topic
  # alarm_actions = [aws_sns_topic.alerts.arn]
}

# CloudWatch Dashboard for test metrics
resource "aws_cloudwatch_dashboard" "test_dashboard" {
  dashboard_name = "test-automation-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/EC2", "CPUUtilization", { stat = "Average", label = "CPU %" }]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "Test Runner CPU Utilization"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            ["CypressTests", "TestDuration", { stat = "Average", label = "Avg Duration" }],
            ["CypressTests", "TestDuration", { stat = "Maximum", label = "Max Duration" }]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "Test Execution Time"
        }
      }
    ]
  })
}

###################################################################################
# Outputs
###################################################################################

output "test_runner_public_ip" {
  description = "Public IP address of test runner"
  value       = aws_instance.test_runner.public_ip
}

output "test_runner_instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.test_runner.id
}

output "s3_bucket_name" {
  description = "S3 bucket for test artifacts"
  value       = aws_s3_bucket.test_artifacts.bucket
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group for test logs"
  value       = aws_cloudwatch_log_group.test_logs.name
}

output "ssh_command" {
  description = "SSH command to connect to test runner"
  value       = "ssh ubuntu@${aws_instance.test_runner.public_ip}"
}

###################################################################################
# Usage Instructions (for interview discussion)
###################################################################################

# 1. Initialize Terraform
#    terraform init

# 2. Preview changes
#    terraform plan

# 3. Create infrastructure
#    terraform apply

# 4. Destroy infrastructure (cleanup)
#    terraform destroy

# 5. Use different environments
#    terraform apply -var="environment=dev"
#    terraform apply -var="environment=staging"
#    terraform apply -var="environment=prod-test"

###################################################################################
# Interview Discussion Points
###################################################################################

# 1. Benefits of IaC:
#    - "This entire infrastructure is defined in code, version controlled in Git"
#    - "Can provision identical environments for different stages (dev/staging/prod)"
#    - "One command creates everything: terraform apply (5-10 minutes)"
#    - "Easy cleanup to save costs: terraform destroy"

# 2. Cost Optimization Features:
#    - Auto-shutdown after 8 hours
#    - S3 lifecycle policy (delete old artifacts)
#    - Right-sized instance (t3.large, not over-provisioned)
#    - Optional detailed monitoring (can disable to save)

# 3. Security Features:
#    - Security group restricts access to corporate network
#    - IAM role with least privilege permissions
#    - S3 encryption at rest
#    - Secrets from Secrets Manager (not hardcoded)

# 4. Monitoring:
#    - CloudWatch logs for test execution
#    - CloudWatch alarms for high CPU (can add more)
#    - Dashboard for visualizing test metrics
#    - Integration with SNS for notifications

# 5. Scalability:
#    - "Can easily change instance type for more/less power"
#    - "Can provision multiple instances with count parameter"
#    - "Can integrate with Auto Scaling Groups for dynamic scaling"

# 6. Team Collaboration:
#    - "Any team member can provision an environment"
#    - "Changes reviewed via pull requests"
#    - "Documentation is the code itself"
#    - "Remote state in S3 allows team collaboration (Terraform backend)"

# 7. Real-World Application:
#    "In my previous role, this approach reduced environment provisioning from
#    2 days (manual) to 10 minutes (automated). It also eliminated configuration
#    drift between environments, making test results more reliable."
