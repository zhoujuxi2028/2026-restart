# Cloud Testing: Practical Examples

This directory contains real-world examples of cloud testing implementations. These examples demonstrate Infrastructure as Code, serverless testing, and cloud-native architectures.

## Files in This Directory

### 1. `aws-lambda-test-function.js`
**Purpose**: Serverless API health check function
**Platform**: AWS Lambda
**Use Case**: Smoke tests, continuous monitoring, scheduled health checks

**Key Concepts Demonstrated**:
- Serverless testing (no infrastructure management)
- Parallel test execution with Promise.allSettled()
- Integration with CloudWatch Logs
- Error handling and alerting
- Cost-effective testing ($0.20 per 1 million requests)

**Interview Talking Points**:
> "This Lambda function runs smoke tests automatically after every deployment. It's incredibly cost-effective - we pay only when tests run, not for idle infrastructure. The function can be triggered by CloudWatch Events (schedule), API Gateway (manual), or CodePipeline (CI/CD integration)."

**Running Locally**:
```bash
# Install dependencies
npm install

# Test locally with sample event
node -e "require('./aws-lambda-test-function').handler({}, {})"
```

**Deploying to AWS**:
```bash
# Package
zip function.zip aws-lambda-test-function.js

# Deploy
aws lambda create-function \
  --function-name api-health-check \
  --runtime nodejs18.x \
  --handler aws-lambda-test-function.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::ACCOUNT:role/lambda-execution-role \
  --environment Variables="{ENVIRONMENT=staging}"

# Schedule (run every 5 minutes)
aws events put-rule \
  --name health-check-schedule \
  --schedule-expression 'rate(5 minutes)'
```

---

### 2. `terraform-test-infrastructure.tf`
**Purpose**: Complete test infrastructure as code
**Platform**: AWS (via Terraform)
**Use Case**: Provisioning reproducible test environments

**Components Provisioned**:
- **EC2 Instance**: Test runner with Docker pre-installed
- **S3 Bucket**: Storage for test artifacts (screenshots, videos, reports)
- **IAM Roles**: Secure permissions for test runner
- **CloudWatch**: Logging and monitoring
- **Security Groups**: Network access control

**Key Concepts Demonstrated**:
- Infrastructure as Code (IaC)
- Version-controlled infrastructure
- Cost optimization (auto-shutdown, lifecycle policies)
- Security best practices (IAM, encryption)
- Monitoring and observability

**Interview Talking Points**:
> "This Terraform configuration defines our entire test infrastructure. It's version controlled in Git, so we can track changes, review via pull requests, and provision identical environments for different stages. With one command - terraform apply - we have a complete test environment in 10 minutes."

**Usage**:

**Step 1: Install Terraform**
```bash
# macOS
brew install terraform

# Linux
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform
```

**Step 2: Configure AWS Credentials**
```bash
# Option 1: Environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"

# Option 2: AWS CLI configuration
aws configure
```

**Step 3: Initialize Terraform**
```bash
terraform init
```

**Step 4: Preview Changes**
```bash
terraform plan
```

**Step 5: Create Infrastructure**
```bash
terraform apply
# Review the plan, type 'yes' to proceed
```

**Step 6: Use the Environment**
```bash
# SSH into test runner
ssh ubuntu@<public-ip-from-output>

# Upload test results to S3
aws s3 cp test-report.html s3://<bucket-name-from-output>/reports/
```

**Step 7: Destroy Infrastructure (Cleanup)**
```bash
terraform destroy
# Type 'yes' to confirm
```

**Cost Estimation**:
- EC2 t3.large: ~$0.08/hour = $60/month (if running 24/7)
  - With 8-hour auto-shutdown: ~$20/month (business hours only)
- S3 storage: ~$0.023/GB/month
  - With lifecycle policy: <$5/month
- CloudWatch: ~$5/month
- **Total**: ~$30/month (optimized) vs $200/month (unoptimized)

---

## Cloud Testing Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Developer Workflow                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
                    Git Push (Code)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     CI/CD Pipeline                           │
│                   (GitHub Actions / GitLab CI)               │
└─────────────────────────────────────────────────────────────┘
                           │
                  ┌────────┴────────┐
                  ▼                 ▼
       ┌──────────────────┐  ┌──────────────────┐
       │  Lambda Function │  │  EC2 Test Runner │
       │   (Smoke Tests)  │  │  (E2E Tests)     │
       └──────────────────┘  └──────────────────┘
                  │                 │
                  └────────┬────────┘
                           ▼
                  ┌──────────────────┐
                  │    S3 Bucket     │
                  │  (Test Artifacts)│
                  └──────────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   CloudWatch     │
                  │  (Monitoring)    │
                  └──────────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │      Alerts      │
                  │  (Slack / Email) │
                  └──────────────────┘
```

---

## Comparing Cloud Service Models

### Example Scenario: Running Cypress Tests in the Cloud

#### Option 1: IaaS (EC2 with `terraform-test-infrastructure.tf`)
```
Provision EC2 → Install Docker → Pull Cypress image → Run tests
```
**Pros**: Full control, customizable
**Cons**: More management, slower to start
**Cost**: ~$60/month (24/7) or ~$20/month (business hours only)

#### Option 2: PaaS (AWS Fargate)
```yaml
# Task definition: Deploy Cypress container directly
containerDefinitions:
  - name: cypress-tests
    image: cypress/included:latest
    command: ["npx", "cypress", "run"]
```
**Pros**: No server management, faster deployment
**Cons**: Less control than EC2
**Cost**: ~$0.04 per test run (pay per execution)

#### Option 3: SaaS (BrowserStack / Sauce Labs)
```javascript
// Integrate Cypress with BrowserStack
module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      require('browserstack-cypress-cli/bin/setup')(on, config);
    },
  },
};
```
**Pros**: Zero infrastructure, instant access
**Cons**: Least control, ongoing subscription
**Cost**: ~$100-$300/month (subscription)

---

## Security Best Practices Demonstrated

1. **Secrets Management**:
   - API keys stored in AWS Secrets Manager (not hardcoded)
   - Retrieved at runtime via IAM role

2. **Least Privilege IAM**:
   - Test runner can only access test-related resources
   - Cannot modify production infrastructure

3. **Network Isolation**:
   - Security groups restrict access to corporate network
   - VPC isolation (can be added)

4. **Encryption**:
   - S3 buckets encrypted at rest (AES-256)
   - HTTPS for all API communication

5. **Audit Logging**:
   - CloudWatch logs all test execution
   - CloudTrail tracks infrastructure changes (enable separately)

---

## Cost Optimization Features

1. **Auto-Shutdown**:
   - EC2 instances automatically stop after 8 hours
   - Prevents paying for idle infrastructure

2. **S3 Lifecycle Policies**:
   - Test artifacts deleted after 30 days
   - Moved to Glacier (cheaper storage) after 7 days

3. **Right-Sizing**:
   - t3.large (not over-provisioned t3.2xlarge)
   - Can adjust based on actual usage

4. **Serverless**:
   - Lambda billed per 100ms of execution
   - No cost when not running

5. **Spot Instances** (advanced):
   - 70-90% discount for non-critical test runs
   - Can be added to Terraform configuration

---

## Interview Preparation Checklist

After reviewing these examples, you should be able to:

- [ ] Explain serverless testing benefits and use cases
- [ ] Discuss Infrastructure as Code (Terraform) advantages
- [ ] Compare IaaS, PaaS, SaaS for testing scenarios
- [ ] Describe cost optimization strategies
- [ ] Discuss security considerations (IAM, secrets, encryption)
- [ ] Explain how to integrate cloud testing with CI/CD
- [ ] Draw a cloud testing architecture diagram
- [ ] Estimate cloud testing costs

---

## Additional Resources

**Terraform Documentation**:
- [AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Tutorial](https://learn.hashicorp.com/terraform)

**AWS Lambda Documentation**:
- [Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

**Cloud Testing Guides**:
- [AWS Testing Best Practices](https://aws.amazon.com/getting-started/hands-on/test-applications/)
- [Azure DevOps Test Plans](https://docs.microsoft.com/en-us/azure/devops/test/)

---

## Next Steps

1. **Understand the concepts** in these examples (don't worry if you can't run them)
2. **Practice explaining** each example in your own words
3. **Relate to your experience**: How could you use these patterns in your projects?
4. **Prepare answers**: Use these examples in interview responses

Remember: **Understanding concepts > memorizing syntax**. Focus on the "why" and "how" rather than exact code.
