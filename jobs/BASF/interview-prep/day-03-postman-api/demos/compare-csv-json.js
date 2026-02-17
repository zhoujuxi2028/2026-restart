#!/usr/bin/env node

/**
 * compare-csv-json.js
 *
 * Educational script to compare CSV and JSON execution side-by-side
 *
 * Purpose: Show key differences and similarities when running
 * the same Postman collection with different data file formats
 *
 * Usage: node compare-csv-json.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// PARSING FUNCTIONS
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

function createIterationDataAPI(iterationObject) {
    return {
        get: function(fieldName) {
            return iterationObject[fieldName];
        }
    };
}

function detectDataSource(iterationData) {
    const name = iterationData.get('name');
    return name ? 'JSON' : 'CSV';
}

// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

function printHeader(title) {
    console.log('\n' + '='.repeat(80));
    console.log(title);
    console.log('='.repeat(80));
}

function displayHighLevelComparison(csvData, jsonData) {
    printHeader('HIGH-LEVEL COMPARISON');

    console.log('\n┌──────────────────────────┬────────────────────┬────────────────────┐');
    console.log('│ Aspect                   │ CSV Execution      │ JSON Execution     │');
    console.log('├──────────────────────────┼────────────────────┼────────────────────┤');
    console.log(`│ Data File                │ test-data.csv      │ test-users.json    │`);
    console.log(`│ Iterations               │ ${String(csvData.length).padEnd(18)} │ ${String(jsonData.length).padEnd(18)} │`);
    console.log(`│ Fields Available         │ 4 (no 'name')      │ 5 (has 'name')     │`);
    console.log(`│ Total Requests           │ ${String(csvData.length * 3).padEnd(18)} │ ${String(jsonData.length * 3).padEnd(18)} │`);
    console.log('│ Request 1 (CSV-opt)      │ ✅ Optimal         │ ✅ Works fine      │');
    console.log('│ Request 2 (JSON-opt)     │ ⚠️  \'name\' empty   │ ✅ Optimal         │');
    console.log('│ Request 3 (Universal)    │ ✅ Auto-detects CSV│ ✅ Auto-detects JSON│');
    console.log('└──────────────────────────┴────────────────────┴────────────────────┘');

    console.log('\n💡 KEY INSIGHT: Same request count (15) with both data sources!');
    console.log('   ALL requests execute regardless of which data file is used.\n');
}

function displayIterationComparison(csvData, jsonData) {
    printHeader('ITERATION 1 COMPARISON');

    const csvIteration = csvData[0];
    const jsonIteration = jsonData[0];

    console.log('\n📄 CSV Data (testuser1):');
    Object.keys(csvIteration).forEach(key => {
        const value = csvIteration[key] || 'undefined';
        console.log(`  ├─ ${key}: "${value}"`);
    });
    console.log('  └─ name: undefined ❌\n');

    console.log('📄 JSON Data (johndoe):');
    Object.keys(jsonIteration).forEach(key => {
        const value = jsonIteration[key];
        console.log(`  ├─ ${key}: "${value}"`);
    });
    console.log('  └─ name: "' + (jsonIteration.name || '') + '" ✅\n');
}

function displayRequestComparison(requestNum, requestName, csvBodyTemplate, jsonBodyTemplate, csvData, jsonData) {
    printHeader(`REQUEST ${requestNum}: ${requestName}`);

    const csvIteration = csvData[0];
    const jsonIteration = jsonData[0];
    const csvIterData = createIterationDataAPI(csvIteration);
    const jsonIterData = createIterationDataAPI(jsonIteration);

    console.log('\nRequest Body Template:');
    console.log(csvBodyTemplate || jsonBodyTemplate);

    // Substitute variables for both
    const csvBody = (csvBodyTemplate || jsonBodyTemplate).replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        const value = csvIterData.get(varName);
        return value !== undefined && value !== '' ? value : '';
    });

    const jsonBody = (jsonBodyTemplate || csvBodyTemplate).replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        const value = jsonIterData.get(varName);
        return value !== undefined && value !== '' ? value : '';
    });

    console.log('\n┌─────────────────────────────────┬─────────────────────────────────┐');
    console.log('│ WITH CSV:                       │ WITH JSON:                      │');
    console.log('├─────────────────────────────────┼─────────────────────────────────┤');

    const csvLines = csvBody.split('\n');
    const jsonLines = jsonBody.split('\n');
    const maxLines = Math.max(csvLines.length, jsonLines.length);

    for (let i = 0; i < maxLines; i++) {
        const csvLine = (csvLines[i] || '').padEnd(31);
        const jsonLine = (jsonLines[i] || '').padEnd(31);
        console.log(`│ ${csvLine} │ ${jsonLine} │`);
    }

    console.log('└─────────────────────────────────┴─────────────────────────────────┘');

    // Analysis
    console.log('\n📊 Analysis:');
    if (requestNum === 1) {
        console.log('  CSV:  ✅ Works perfectly - all fields populated');
        console.log('  JSON: ✅ Works perfectly - ignores extra \'name\' field');
    } else if (requestNum === 2) {
        console.log('  CSV:  ⚠️  \'name\' field is empty (not in CSV)');
        console.log('  JSON: ✅ Works perfectly - all fields populated');
        console.log('  Note: Request still executes with CSV, but \'name\' is empty string');
    } else if (requestNum === 3) {
        const csvSource = detectDataSource(csvIterData);
        const jsonSource = detectDataSource(jsonIterData);
        console.log(`  CSV:  ✅ Auto-detects "${csvSource}" - test names adapt`);
        console.log(`  JSON: ✅ Auto-detects "${jsonSource}" - test names adapt`);
        console.log('  Pattern: const dataSource = name ? \'JSON\' : \'CSV\'');
    }
}

function displayKeyTakeaways() {
    printHeader('KEY TAKEAWAYS');

    console.log('\n1. ONE Data File Per Execution:');
    console.log('   ❌ WRONG: newman run collection.json -d file1.csv -d file2.json');
    console.log('   ✅ RIGHT: newman run collection.json -d file1.csv');
    console.log('   ✅ RIGHT: newman run collection.json -d file2.json');

    console.log('\n2. ALL Requests Execute:');
    console.log('   ✓ Collection has 3 request groups');
    console.log('   ✓ CSV execution: ALL 3 requests run for EACH iteration');
    console.log('   ✓ JSON execution: ALL 3 requests run for EACH iteration');
    console.log('   ✓ No filtering based on data file type!');

    console.log('\n3. Same Total Request Count:');
    console.log('   ✓ CSV: 5 iterations × 3 requests = 15 total');
    console.log('   ✓ JSON: 5 iterations × 3 requests = 15 total');
    console.log('   ✓ Only DATA VALUES differ, not execution structure');

    console.log('\n4. Variable Substitution Adapts:');
    console.log('   ✓ {{username}} gets CSV value OR JSON value');
    console.log('   ✓ {{name}} gets empty string (CSV) OR actual name (JSON)');
    console.log('   ✓ No errors when variable is undefined - graceful handling');

    console.log('\n5. Universal Test Pattern:');
    console.log('   ✓ Detects data source: const dataSource = name ? \'JSON\' : \'CSV\'');
    console.log('   ✓ Adapts test names: [CSV] vs [JSON]');
    console.log('   ✓ Best practice for flexible collections');

    console.log('\n6. Production Implications:');
    console.log('   ✓ Same collection works with both formats');
    console.log('   ✓ Just swap -d parameter in CI/CD pipeline');
    console.log('   ✓ CSV for simple data, JSON for complex nested structures');
    console.log('   ✓ No code changes needed!');
}

function displayInterviewAnswer() {
    printHeader('INTERVIEW ANSWER TEMPLATE');

    console.log('\n🎤 Interviewer: "How does your Postman collection handle different data formats?"');
    console.log('\n💬 Your Answer:');
    console.log('"I designed the collection to work with both CSV and JSON data files using');
    console.log('Newman\'s data-driven testing feature. When you run Newman with the -d flag,');
    console.log('it accepts one data file and creates iterations - one per row for CSV or one');
    console.log('per object for JSON.');
    console.log('');
    console.log('The key is using pm.iterationData.get() API in test scripts, which works');
    console.log('identically regardless of format. For example, pm.iterationData.get(\'username\')');
    console.log('retrieves the username value from the current iteration whether it came from');
    console.log('a CSV column or JSON property.');
    console.log('');
    console.log('I also implemented a \'universal test\' pattern that detects which data source');
    console.log('is being used by checking for fields unique to one format. This allows test');
    console.log('names and assertions to adapt automatically.');
    console.log('');
    console.log('The benefit is flexibility - the same collection can run smoke tests with a');
    console.log('simple 10-row CSV or comprehensive regression with a complex 500-object JSON');
    console.log('file. Just swap the data file in CI/CD pipelines without changing any code."');
}

function displayRealWorldUsage() {
    printHeader('REAL-WORLD USAGE GUIDE');

    console.log('\n📋 When to Use CSV:');
    console.log('  ✅ Smoke tests (10-50 simple test cases)');
    console.log('  ✅ Regression suites (1000+ rows)');
    console.log('  ✅ Data exported from databases or Excel');
    console.log('  ✅ Sharing test data with non-technical stakeholders');
    console.log('  ✅ Simple, flat data structures');

    console.log('\n📋 When to Use JSON:');
    console.log('  ✅ Complex payloads with nested objects/arrays');
    console.log('  ✅ Dynamic data (timestamps, UUIDs, calculated fields)');
    console.log('  ✅ Realistic API responses');
    console.log('  ✅ Integration tests with complex data relationships');
    console.log('  ✅ Chaining requests (save response, use in next request)');

    console.log('\n📋 Universal Pattern Best Practices:');
    console.log('  ✅ Always check for undefined before using field values');
    console.log('  ✅ Use data source detection for adaptive test names');
    console.log('  ✅ Include common fields that work with both formats');
    console.log('  ✅ Document which fields are required vs optional');
    console.log('  ✅ Test collection with BOTH data formats in CI/CD');

    console.log('\n📋 CI/CD Pipeline Example:');
    console.log('  # Smoke tests with CSV (fast, 10 test cases)');
    console.log('  newman run collection.json -d smoke-tests.csv --bail');
    console.log('');
    console.log('  # Full regression with JSON (comprehensive, 500 test cases)');
    console.log('  newman run collection.json -d regression-tests.json \\');
    console.log('      -r html,junit \\');
    console.log('      --reporter-html-export report.html \\');
    console.log('      --reporter-junit-export results.xml');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
    const scriptDir = __dirname;
    const csvFile = path.join(scriptDir, '../fixtures/test-data.csv');
    const jsonFile = path.join(scriptDir, '../fixtures/test-users.json');

    // Check files exist
    if (!fs.existsSync(csvFile) || !fs.existsSync(jsonFile)) {
        console.error('❌ Data files not found. Make sure you\'re running from demos/ directory');
        process.exit(1);
    }

    // Parse both files
    const csvData = parseCSV(csvFile);
    const jsonData = parseJSON(jsonFile);

    // Display comparisons
    console.log('\n');
    printHeader('CSV vs JSON: SIDE-BY-SIDE COMPARISON');
    console.log('\nThis demonstration shows how the SAME Postman collection executes');
    console.log('with different data file formats (CSV vs JSON).');

    displayHighLevelComparison(csvData, jsonData);
    displayIterationComparison(csvData, jsonData);

    // Compare each request
    displayRequestComparison(
        1,
        'CSV-Optimized Test',
        `{
    "username": "{{username}}",
    "email": "{{email}}",
    "role": "{{role}}"
}`,
        null,
        csvData,
        jsonData
    );

    displayRequestComparison(
        2,
        'JSON-Optimized Test',
        null,
        `{
    "name": "{{name}}",
    "username": "{{username}}",
    "email": "{{email}}",
    "role": "{{role}}"
}`,
        csvData,
        jsonData
    );

    displayRequestComparison(
        3,
        'Universal Test (Smart Detection)',
        `{
    "username": "{{username}}",
    "email": "{{email}}",
    "role": "{{role}}"
}`,
        null,
        csvData,
        jsonData
    );

    // Display takeaways and guidance
    displayKeyTakeaways();
    displayInterviewAnswer();
    displayRealWorldUsage();

    // Verification commands
    printHeader('VERIFICATION COMMANDS');
    console.log('\nRun these to see real Newman output:\n');
    console.log('# CSV execution');
    console.log('newman run 04-postman-data-driven-collection-fixed.json \\');
    console.log('    -d fixtures/test-data.csv \\');
    console.log('    -r cli\n');
    console.log('# JSON execution');
    console.log('newman run 04-postman-data-driven-collection-fixed.json \\');
    console.log('    -d fixtures/test-users.json \\');
    console.log('    -r cli\n');
    console.log('# Compare - notice identical request counts!\n');

    console.log('='.repeat(80));
    console.log('✅ Comparison demonstration complete!\n');
}

// Run the script
if (require.main === module) {
    main();
}

// Export functions for testing
module.exports = {
    parseCSV,
    parseJSON,
    displayHighLevelComparison
};
