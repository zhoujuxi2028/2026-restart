/**
 * AWS Lambda Function: API Health Check Test
 *
 * Purpose: Lightweight serverless function to perform API health checks
 * Trigger: Scheduled (CloudWatch Events) or API Gateway
 * Cost: ~$0.20 per 1 million requests
 *
 * Interview Talking Points:
 * - "This demonstrates serverless testing - no infrastructure to manage"
 * - "Ideal for smoke tests and health checks in production"
 * - "Runs in response to events (deployment, schedule, manual trigger)"
 * - "Very cost-effective compared to maintaining test infrastructure"
 */

const https = require('https');

/**
 * Main Lambda handler function
 * @param {Object} event - Lambda event object
 * @param {Object} context - Lambda context object
 * @returns {Object} - Response with status and test results
 */
exports.handler = async (event, context) => {
    console.log('Starting API health check tests...');

    const testResults = {
        timestamp: new Date().toISOString(),
        environment: process.env.ENVIRONMENT || 'production',
        tests: [],
        passed: 0,
        failed: 0,
        totalDuration: 0
    };

    // Test Suite: Critical API Endpoints
    const endpoints = [
        {
            name: 'Health Check',
            url: 'https://api.example.com/health',
            method: 'GET',
            expectedStatus: 200,
            timeout: 5000
        },
        {
            name: 'Authentication Service',
            url: 'https://api.example.com/auth/status',
            method: 'GET',
            expectedStatus: 200,
            timeout: 5000
        },
        {
            name: 'Database Connectivity',
            url: 'https://api.example.com/api/v1/status/db',
            method: 'GET',
            expectedStatus: 200,
            timeout: 10000
        }
    ];

    // Execute tests in parallel for speed
    const testPromises = endpoints.map(endpoint => runTest(endpoint));
    const results = await Promise.allSettled(testPromises);

    // Process results
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            testResults.tests.push(result.value);
            if (result.value.passed) {
                testResults.passed++;
            } else {
                testResults.failed++;
            }
            testResults.totalDuration += result.value.duration;
        } else {
            // Test execution failed
            testResults.tests.push({
                name: endpoints[index].name,
                passed: false,
                error: result.reason.message,
                duration: 0
            });
            testResults.failed++;
        }
    });

    // Send notification if any tests failed (optional: integrate with SNS/Slack)
    if (testResults.failed > 0) {
        await sendAlertNotification(testResults);
    }

    // Store results in S3 for historical tracking (optional)
    if (process.env.RESULTS_BUCKET) {
        await storeResults(testResults);
    }

    console.log(`Tests completed: ${testResults.passed} passed, ${testResults.failed} failed`);

    // Return response
    return {
        statusCode: testResults.failed === 0 ? 200 : 500,
        body: JSON.stringify({
            message: testResults.failed === 0 ? 'All tests passed' : 'Some tests failed',
            results: testResults
        })
    };
};

/**
 * Execute a single test against an API endpoint
 * @param {Object} endpoint - Endpoint configuration
 * @returns {Promise<Object>} - Test result
 */
function runTest(endpoint) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const url = new URL(endpoint.url);
        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: endpoint.method,
            timeout: endpoint.timeout,
            headers: {
                'User-Agent': 'AWS-Lambda-Health-Check/1.0',
                'Accept': 'application/json'
            }
        };

        // Add authentication if provided (from environment variables)
        if (process.env.API_KEY) {
            options.headers['Authorization'] = `Bearer ${process.env.API_KEY}`;
        }

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const duration = Date.now() - startTime;
                const passed = res.statusCode === endpoint.expectedStatus;

                resolve({
                    name: endpoint.name,
                    url: endpoint.url,
                    method: endpoint.method,
                    expectedStatus: endpoint.expectedStatus,
                    actualStatus: res.statusCode,
                    passed: passed,
                    duration: duration,
                    responseSize: data.length,
                    error: passed ? null : `Expected ${endpoint.expectedStatus}, got ${res.statusCode}`
                });
            });
        });

        req.on('error', (error) => {
            const duration = Date.now() - startTime;
            resolve({
                name: endpoint.name,
                url: endpoint.url,
                passed: false,
                duration: duration,
                error: error.message
            });
        });

        req.on('timeout', () => {
            req.destroy();
            const duration = Date.now() - startTime;
            resolve({
                name: endpoint.name,
                url: endpoint.url,
                passed: false,
                duration: duration,
                error: `Timeout after ${endpoint.timeout}ms`
            });
        });

        req.end();
    });
}

/**
 * Send alert notification when tests fail
 * Integration options: SNS, Slack, Email
 */
async function sendAlertNotification(testResults) {
    // Example: Send to SNS topic
    // const AWS = require('aws-sdk');
    // const sns = new AWS.SNS();
    //
    // await sns.publish({
    //     TopicArn: process.env.ALERT_SNS_TOPIC,
    //     Subject: '🚨 API Health Check Failed',
    //     Message: JSON.stringify(testResults, null, 2)
    // }).promise();

    console.log('Alert notification sent (implementation depends on your notification system)');
}

/**
 * Store test results in S3 for historical tracking and analysis
 */
async function storeResults(testResults) {
    // Example: Store in S3
    // const AWS = require('aws-sdk');
    // const s3 = new AWS.S3();
    //
    // const key = `test-results/${testResults.environment}/${testResults.timestamp}.json`;
    //
    // await s3.putObject({
    //     Bucket: process.env.RESULTS_BUCKET,
    //     Key: key,
    //     Body: JSON.stringify(testResults),
    //     ContentType: 'application/json'
    // }).promise();

    console.log('Test results stored in S3 (implementation placeholder)');
}

/**
 * Interview Discussion Points:
 *
 * 1. Serverless Benefits:
 *    - "No servers to manage or patch"
 *    - "Automatic scaling (1 request or 1 million)"
 *    - "Pay only for execution time (billed per 100ms)"
 *    - "High availability built-in"
 *
 * 2. Use Cases for Serverless Testing:
 *    - Smoke tests after deployment
 *    - Scheduled health checks (every 5 minutes)
 *    - API contract validation
 *    - Performance monitoring
 *
 * 3. Limitations:
 *    - 15-minute maximum execution time (AWS Lambda)
 *    - Cold start latency (first invocation)
 *    - Not suitable for heavy UI tests (use containers instead)
 *    - Limited environment customization
 *
 * 4. Integration with CI/CD:
 *    ```yaml
 *    # GitLab CI example
 *    smoke-tests:
 *      stage: verify
 *      script:
 *        - aws lambda invoke \
 *            --function-name api-health-check \
 *            --payload '{"environment":"staging"}' \
 *            response.json
 *        - cat response.json
 *    ```
 *
 * 5. Cost Example:
 *    - 1 million requests per month
 *    - Average 200ms execution time
 *    - 512MB memory
 *    - Cost: ~$0.20/month (vs $50/month for always-on EC2)
 *
 * 6. Deployment:
 *    ```bash
 *    # Package function
 *    zip function.zip aws-lambda-test-function.js
 *
 *    # Deploy to AWS
 *    aws lambda create-function \
 *      --function-name api-health-check \
 *      --runtime nodejs18.x \
 *      --handler aws-lambda-test-function.handler \
 *      --zip-file fileb://function.zip \
 *      --role arn:aws:iam::ACCOUNT:role/lambda-execution-role
 *
 *    # Schedule with CloudWatch Events (run every 5 minutes)
 *    aws events put-rule \
 *      --name health-check-schedule \
 *      --schedule-expression 'rate(5 minutes)'
 *    ```
 */
