#!/usr/bin/env node

/**
 * simulate-iterations.js
 *
 * Educational script to simulate Newman's iteration mechanism
 * including variable substitution and request execution.
 *
 * Purpose: Demonstrate how Newman executes data-driven tests
 * - How iterations are processed
 * - How pm.iterationData.get() works
 * - How variable substitution happens ({{variable}})
 * - The "Universal Test" pattern for data source detection
 *
 * Usage: node simulate-iterations.js [csv|json]
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// PARSING FUNCTIONS (from parse-data-files.js)
// ============================================================================

function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map((line, index) => {
        const values = line.split(',');
        const iteration = {};
        headers.forEach((header, i) => {
            iteration[header] = values[i]?.trim() || '';
        });
        return iteration;
    });
}

function parseJSON(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}

// ============================================================================
// NEWMAN SIMULATION FUNCTIONS
// ============================================================================

/**
 * Creates a mock pm.iterationData API
 * This mimics how Newman provides data to test scripts
 */
function createIterationDataAPI(iterationObject) {
    return {
        get: function(fieldName) {
            return iterationObject[fieldName];
        },
        // For debugging - not part of real Newman API
        _data: iterationObject
    };
}

/**
 * Substitutes {{variable}} placeholders with actual values
 * This mimics how Newman processes request bodies
 */
function substituteVariables(template, iterationData) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        const value = iterationData.get(varName);
        return value !== undefined ? value : '';
    });
}

/**
 * Detects data source (CSV or JSON) by checking for format-specific fields
 * This is the "Universal Test" pattern
 */
function detectDataSource(iterationData) {
    const name = iterationData.get('name');
    return name ? 'JSON' : 'CSV';
}

/**
 * Simulates execution of a single request
 */
function simulateRequest(requestConfig, iterationData, iterationNum, totalIterations) {
    const { name, bodyTemplate, requestGroup } = requestConfig;

    console.log('┌' + '─'.repeat(60) + '┐');
    console.log('│ ' + name.padEnd(58) + ' │');
    console.log('└' + '─'.repeat(60) + '┘\n');

    // Show request body template
    console.log('Request Body Template:');
    console.log(bodyTemplate);

    // Show variable substitution process
    console.log('\nVariable Substitution:');
    const variables = bodyTemplate.match(/\{\{(\w+)\}\}/g);
    if (variables) {
        variables.forEach(variable => {
            const varName = variable.slice(2, -2); // Remove {{ and }}
            const value = iterationData.get(varName);
            const displayValue = value !== undefined && value !== '' ? value : '(empty)';
            const warning = (value === undefined || value === '') && varName === 'name' ? ' ⚠️  CSV has no \'name\' field!' : '';
            console.log(`  ${variable.padEnd(20)} → ${displayValue}${warning}`);
        });
    }

    // Show final request body
    const finalBody = substituteVariables(bodyTemplate, iterationData);
    console.log('\nFinal Request Body:');
    console.log(finalBody);

    // Simulate HTTP request
    const responseTime = Math.floor(Math.random() * 100) + 250; // 250-350ms
    console.log(`\nSending: POST https://jsonplaceholder.typicode.com/users`);
    console.log(`[Simulated] Status: 201, Time: ${responseTime}ms`);

    // Show test results
    console.log('\n┌' + '─'.repeat(60) + '┐');
    console.log('│ TEST SCRIPT OUTPUT'.padEnd(61) + '│');
    console.log('└' + '─'.repeat(60) + '┘');

    const expectedStatus = iterationData.get('expectedStatus');

    if (requestGroup === 'csv-optimized') {
        console.log('✓ Response received (expected ' + expectedStatus + ')');
        if (expectedStatus === '201') {
            console.log('✓ Response contains user ID');
            console.log('✓ Username matches CSV input');
            const username = iterationData.get('username');
            console.log(`✅ User created: ${username}`);
        } else if (expectedStatus === '400') {
            console.log('📝 Testing validation error scenario (empty email)');
        } else if (expectedStatus === '409') {
            console.log('📝 Testing duplicate email scenario');
        }
    } else if (requestGroup === 'json-optimized') {
        console.log('✓ Response received (expected ' + expectedStatus + ')');
        if (expectedStatus === '201' || expectedStatus === 201) {
            console.log('✓ User created with ID');
            console.log('✓ Response data matches JSON input');
            const username = iterationData.get('username');
            const email = iterationData.get('email');
            const name = iterationData.get('name');
            const displayName = name || username;
            console.log(`✅ User created: ${displayName} (${email})`);
        } else {
            console.log('📝 Testing validation error (invalid data)');
        }
    } else if (requestGroup === 'universal') {
        // Universal test pattern - detect data source
        const dataSource = detectDataSource(iterationData);
        console.log(`📂 Data source: ${dataSource} file`);
        console.log(`✓ [${dataSource}] Response received`);
        if (expectedStatus === '201' || expectedStatus === 201) {
            console.log(`✓ [${dataSource}] User created successfully`);
            const username = iterationData.get('username');
            console.log(`✅ Test passed for: ${username}`);
        }
    }

    console.log(`Status: 201, Time: ${responseTime}ms`);
}

/**
 * Simulates a complete Newman execution with one data file
 */
function simulateExecution(dataFilePath) {
    console.log('\n');
    console.log('='.repeat(80));
    console.log('NEWMAN ITERATION SIMULATION');
    console.log('='.repeat(80));

    // Determine file type and parse
    const isCSV = dataFilePath.endsWith('.csv');
    const iterations = isCSV ? parseCSV(dataFilePath) : parseJSON(dataFilePath);
    const fileName = path.basename(dataFilePath);

    console.log(`\nCommand: newman run collection.json -d fixtures/${fileName}\n`);

    // Define the 3 requests in the collection
    const requests = [
        {
            name: 'REQUEST 1: POST Create User (CSV)',
            requestGroup: 'csv-optimized',
            bodyTemplate: `{
    "username": "{{username}}",
    "email": "{{email}}",
    "role": "{{role}}"
}`
        },
        {
            name: 'REQUEST 2: POST Create User (JSON)',
            requestGroup: 'json-optimized',
            bodyTemplate: `{
    "name": "{{name}}",
    "username": "{{username}}",
    "email": "{{email}}",
    "role": "{{role}}"
}`
        },
        {
            name: 'REQUEST 3: Universal User Creation',
            requestGroup: 'universal',
            bodyTemplate: `{
    "username": "{{username}}",
    "email": "{{email}}",
    "role": "{{role}}"
}`
        }
    ];

    let totalRequests = 0;
    let totalTests = 0;

    // Execute first iteration in detail
    console.log('━'.repeat(80));
    console.log(`📊 ITERATION 1/${iterations.length}`);
    console.log('━'.repeat(80));

    const firstIteration = iterations[0];
    const iterationData = createIterationDataAPI(firstIteration);

    // Show pre-request script output
    console.log('\n┌' + '─'.repeat(60) + '┐');
    console.log('│ PRE-REQUEST SCRIPT OUTPUT'.padEnd(61) + '│');
    console.log('└' + '─'.repeat(60) + '┘');
    console.log('Data from file:');
    Object.keys(firstIteration).forEach(key => {
        const value = firstIteration[key];
        const displayValue = value !== undefined && value !== '' ? value : 'undefined';
        console.log(`  ${key}: ${displayValue}`);
    });
    console.log('');

    // Execute each request for first iteration
    requests.forEach((request, index) => {
        if (index > 0) console.log('\n━'.repeat(80) + '\n');
        simulateRequest(request, iterationData, 1, iterations.length);
        totalRequests++;
        totalTests += 3; // Each request has ~3 tests
    });

    console.log('\n━'.repeat(80));
    console.log('');

    // Summarize remaining iterations
    if (iterations.length > 1) {
        console.log(`[Iterations 2-${iterations.length} executed with same pattern...]\n`);

        for (let i = 1; i < iterations.length; i++) {
            const iteration = iterations[i];
            console.log(`Iteration ${i + 1}/${iterations.length}:`);
            console.log(`  Data: username="${iteration.username}", email="${iteration.email}", role="${iteration.role}"`);
            console.log(`  Executed: ${requests.length} requests, ~${requests.length * 3} tests passed`);
            totalRequests += requests.length;
            totalTests += requests.length * 3;
        }
    }

    // Execution summary
    console.log('\n');
    console.log('='.repeat(80));
    console.log('EXECUTION SUMMARY');
    console.log('='.repeat(80));
    console.log(`Data Source: ${isCSV ? 'CSV' : 'JSON'} (fixtures/${fileName})`);
    console.log(`Iterations:  ${iterations.length}`);
    console.log(`Requests:    ${totalRequests} (${iterations.length} iterations × ${requests.length} requests)`);
    console.log(`Time:        ~${(totalRequests * 0.3).toFixed(1)}s`);
    console.log(`Tests:       ${totalTests} passed, 0 failed`);

    console.log('\nBreakdown by iteration:');
    iterations.forEach((iteration, index) => {
        const username = iteration.username || '(empty)';
        console.log(`  Iteration ${index + 1}: ${requests.length} requests (${username})`);
    });

    console.log('\n');
    printKeyInsights(isCSV);
}

/**
 * Display key insights from the simulation
 */
function printKeyInsights(isCSV) {
    console.log('='.repeat(80));
    console.log('KEY INSIGHTS FROM SIMULATION');
    console.log('='.repeat(80));

    console.log('\n1. Iteration Mechanism:');
    console.log('   ✓ Newman reads data file → Creates N iterations');
    console.log('   ✓ For EACH iteration: runs ALL requests in collection');
    console.log('   ✓ Total requests = iterations × requests_per_iteration');
    console.log('   ✓ No filtering based on data file type!');

    console.log('\n2. Variable Access (pm.iterationData.get()):');
    console.log('   ✓ Works identically for CSV and JSON');
    console.log('   ✓ Returns field value from current iteration');
    console.log('   ✓ Returns undefined for missing fields (no errors thrown)');
    console.log('   ✓ Graceful handling - empty string in request body');

    console.log('\n3. Variable Substitution:');
    console.log('   ✓ Template: {{username}} → Actual value: "testuser1"');
    console.log('   ✓ Happens before request is sent');
    console.log('   ✓ Undefined variables become empty strings');
    if (isCSV) {
        console.log('   ⚠️  CSV: {{name}} → "" (empty, not in CSV)');
    } else {
        console.log('   ✅ JSON: {{name}} → "John Doe" (has value)');
    }

    console.log('\n4. Universal Test Pattern:');
    console.log('   ✓ Detects data source by checking for format-specific fields');
    console.log('   ✓ Code: const dataSource = name ? \'JSON\' : \'CSV\'');
    console.log('   ✓ Adapts test names: [CSV] vs [JSON]');
    console.log('   ✓ Best practice for flexible collections');

    console.log('\n5. All Requests Execute:');
    console.log('   ✓ CSV-optimized request: runs with CSV ✅ and JSON ✅');
    console.log('   ✓ JSON-optimized request: runs with CSV ⚠️  and JSON ✅');
    console.log('   ✓ Universal request: runs with both ✅');
    console.log('   ✓ Collection doesn\'t filter - ALL requests always run!');

    console.log('\n📝 Interview Answer:');
    console.log('"Newman parses the data file into iterations, then executes ALL');
    console.log('requests in the collection for EACH iteration. The pm.iterationData API');
    console.log('provides access to the current iteration\'s data, and variable substitution');
    console.log('replaces {{placeholders}} with actual values before sending requests.');
    console.log('This means the same collection works with both CSV and JSON - just swap');
    console.log('the data file parameter in CI/CD pipelines."\n');

    console.log('='.repeat(80));
    console.log('✅ Simulation complete!\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
    const scriptDir = __dirname;

    // Parse command line arguments
    const args = process.argv.slice(2);
    const format = args[0] || 'csv'; // Default to CSV

    let dataFile;
    if (format.toLowerCase() === 'json') {
        dataFile = path.join(scriptDir, '../fixtures/test-users.json');
    } else {
        dataFile = path.join(scriptDir, '../fixtures/test-data.csv');
    }

    // Check if file exists
    if (!fs.existsSync(dataFile)) {
        console.error(`❌ Data file not found: ${dataFile}`);
        console.error('Make sure you\'re running this script from the demos/ directory');
        process.exit(1);
    }

    // Run simulation
    simulateExecution(dataFile);

    // Next steps
    console.log('NEXT STEPS:\n');
    if (format.toLowerCase() === 'csv') {
        console.log('1. Run with JSON data: node simulate-iterations.js json');
    } else {
        console.log('1. Run with CSV data: node simulate-iterations.js csv');
    }
    console.log('2. Run compare-csv-json.js to see side-by-side comparison');
    console.log('3. Practice explaining the iteration mechanism in English!\n');
}

// Run the script
if (require.main === module) {
    main();
}

// Export functions for testing
module.exports = {
    createIterationDataAPI,
    substituteVariables,
    detectDataSource,
    simulateRequest
};
