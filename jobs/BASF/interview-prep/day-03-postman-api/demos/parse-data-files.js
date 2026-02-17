#!/usr/bin/env node

/**
 * parse-data-files.js
 *
 * Educational script to demonstrate how CSV and JSON data files
 * are parsed into iterations for Postman/Newman data-driven testing.
 *
 * Purpose: Help understand the first step of Newman's data-driven mechanism
 * - How CSV rows become iteration objects
 * - How JSON array elements become iteration objects
 * - Key differences between CSV and JSON structures
 *
 * Usage: node parse-data-files.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// PARSING FUNCTIONS
// ============================================================================

/**
 * Parse CSV file into array of iteration objects
 * @param {string} filePath - Path to CSV file
 * @returns {Array} Array of iteration objects
 */
function parseCSV(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.trim().split('\n');

        if (lines.length === 0) {
            throw new Error('CSV file is empty');
        }

        // First line is header
        const headers = lines[0].split(',').map(h => h.trim());

        // Parse each data row
        return lines.slice(1).map((line, index) => {
            const values = line.split(',');
            const iteration = { iterationNum: index + 1 };

            headers.forEach((header, i) => {
                iteration[header] = values[i]?.trim() || '';
            });

            return iteration;
        });
    } catch (error) {
        console.error(`Error parsing CSV file: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Parse JSON file into array of iteration objects
 * @param {string} filePath - Path to JSON file
 * @returns {Array} Array of iteration objects
 */
function parseJSON(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);

        if (!Array.isArray(data)) {
            throw new Error('JSON must be an array of objects');
        }

        // Add iteration number to each object
        return data.map((obj, index) => ({
            iterationNum: index + 1,
            ...obj
        }));
    } catch (error) {
        console.error(`Error parsing JSON file: ${error.message}`);
        process.exit(1);
    }
}

// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

/**
 * Display a separator line
 */
function printSeparator(char = '=', length = 80) {
    console.log(char.repeat(length));
}

/**
 * Display a section header
 */
function printHeader(title) {
    printSeparator('=');
    console.log(title);
    printSeparator('=');
}

/**
 * Display iterations in a formatted table
 * @param {Array} iterations - Array of iteration objects
 * @param {string} sourceType - 'CSV' or 'JSON'
 * @param {string} filePath - Path to source file
 */
function displayIterations(iterations, sourceType, filePath) {
    console.log(`File: ${filePath}`);
    console.log(`Parsed ${iterations.length} iterations (${sourceType === 'CSV' ? iterations.length + ' rows - 1 header' : iterations.length + ' array elements'})\n`);

    // Define all possible fields to display
    const allFields = ['iterationNum', 'username', 'email', 'role', 'expectedStatus', 'name'];

    // Calculate column widths
    const columnWidths = {};
    allFields.forEach(field => {
        const maxLength = Math.max(
            field.length,
            ...iterations.map(it => {
                const value = it[field];
                if (value === undefined) return 2; // For ❌
                return String(value).length;
            })
        );
        columnWidths[field] = Math.min(maxLength + 2, 30); // Max 30 chars per column
    });

    // Print table header
    console.log('┌' + allFields.map(f => '─'.repeat(columnWidths[f] + 2)).join('┬') + '┐');
    console.log('│ ' + allFields.map(f => {
        const label = f === 'iterationNum' ? 'Iteration' : f;
        return label.padEnd(columnWidths[f]);
    }).join(' │ ') + ' │');
    console.log('├' + allFields.map(f => '─'.repeat(columnWidths[f] + 2)).join('┼') + '┤');

    // Print each iteration
    iterations.forEach(iteration => {
        const row = allFields.map(field => {
            let value = iteration[field];

            // Special handling for undefined (missing fields)
            if (value === undefined) {
                return '❌'.padEnd(columnWidths[field]);
            }

            // Convert to string and truncate if needed
            value = String(value);
            if (value.length > columnWidths[field] - 2) {
                value = value.substring(0, columnWidths[field] - 4) + '..';
            }

            return value.padEnd(columnWidths[field]);
        });

        console.log('│ ' + row.join(' │ ') + ' │');
    });

    console.log('└' + allFields.map(f => '─'.repeat(columnWidths[f] + 2)).join('┴') + '┘');
}

/**
 * Display key insights about the parsed data
 */
function displayKeyInsights(csvData, jsonData) {
    printHeader('KEY INSIGHTS');

    console.log('\n1. Field Availability:');
    console.log('   CSV has NO \'name\' field → returns undefined in pm.iterationData.get(\'name\')');
    console.log('   JSON HAS \'name\' field → returns actual value in pm.iterationData.get(\'name\')');
    console.log('   This difference enables data source detection!');

    console.log('\n2. Parsing Mechanism:');
    console.log('   CSV: Header row defines field names → Each data row becomes one iteration');
    console.log('   JSON: Array elements are already objects → Each element becomes one iteration');
    console.log('   Result: Both produce arrays of iteration objects with the same structure');

    console.log('\n3. Iteration Count:');
    console.log(`   CSV: ${csvData.length} data rows → ${csvData.length} iterations`);
    console.log(`   JSON: ${jsonData.length} objects → ${jsonData.length} iterations`);
    console.log('   Newman will run ALL requests for EACH iteration');

    console.log('\n4. Newman Execution:');
    const requestCount = 3; // Collection has 3 request groups
    console.log(`   Collection has ${requestCount} request groups`);
    console.log(`   CSV: ${csvData.length} iterations × ${requestCount} requests = ${csvData.length * requestCount} total requests`);
    console.log(`   JSON: ${jsonData.length} iterations × ${requestCount} requests = ${jsonData.length * requestCount} total requests`);
    console.log('   ✅ Same request count with both data sources!');

    console.log('\n5. Variable Access in Newman:');
    console.log('   pm.iterationData.get(\'username\')  → Gets value from current iteration');
    console.log('   pm.iterationData.get(\'email\')     → Gets value from current iteration');
    console.log('   pm.iterationData.get(\'name\')      → Gets value (JSON) or undefined (CSV)');
    console.log('   No errors thrown when field is undefined - graceful handling!');
}

/**
 * Display comparison summary
 */
function displayComparison() {
    printHeader('COMPARISON SUMMARY');

    console.log('\n┌────────────────────────┬─────────────────────────────────────┬─────────────────────────────────────┐');
    console.log('│ Aspect                 │ CSV (test-data.csv)                 │ JSON (test-users.json)              │');
    console.log('├────────────────────────┼─────────────────────────────────────┼─────────────────────────────────────┤');
    console.log('│ Fields                 │ 4 fields                            │ 5 fields                            │');
    console.log('│                        │ username, email,                    │ name, username, email,              │');
    console.log('│                        │ role, expectedStatus                │ role, expectedStatus                │');
    console.log('├────────────────────────┼─────────────────────────────────────┼─────────────────────────────────────┤');
    console.log('│ Extra field            │ ❌ No \'name\' field                  │ ✅ Has \'name\' field                 │');
    console.log('├────────────────────────┼─────────────────────────────────────┼─────────────────────────────────────┤');
    console.log('│ Format                 │ Row-based, comma-separated          │ Object-based, structured            │');
    console.log('├────────────────────────┼─────────────────────────────────────┼─────────────────────────────────────┤');
    console.log('│ Easy to edit?          │ ✅ Yes (Excel, spreadsheet tools)   │ ⚠️  Requires JSON editor             │');
    console.log('├────────────────────────┼─────────────────────────────────────┼─────────────────────────────────────┤');
    console.log('│ Nested structures?     │ ❌ No (flat data only)               │ ✅ Yes (objects, arrays)             │');
    console.log('├────────────────────────┼─────────────────────────────────────┼─────────────────────────────────────┤');
    console.log('│ Best use case          │ Simple test data,                   │ Complex payloads,                   │');
    console.log('│                        │ large datasets (1000+ rows),        │ nested objects,                     │');
    console.log('│                        │ non-technical team members          │ realistic API data                  │');
    console.log('└────────────────────────┴─────────────────────────────────────┴─────────────────────────────────────┘');

    console.log('\n📝 Interview Talking Point:');
    console.log('"I use CSV for simple regression tests with many test cases,');
    console.log('and JSON for complex integration tests with nested data structures.');
    console.log('The same collection works with both - just swap the data file.');
    console.log('This gives us flexibility in CI/CD pipelines without code changes."\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
    console.log('\n');
    printHeader('POSTMAN/NEWMAN DATA FILE PARSING DEMONSTRATION');
    console.log('\nThis script shows how CSV and JSON data files are parsed into iterations.');
    console.log('No Newman installation required - pure Node.js demonstration!\n');

    // File paths (relative to script location)
    const scriptDir = __dirname;
    const csvFile = path.join(scriptDir, '../fixtures/test-data.csv');
    const jsonFile = path.join(scriptDir, '../fixtures/test-users.json');

    // Check if files exist
    if (!fs.existsSync(csvFile)) {
        console.error(`❌ CSV file not found: ${csvFile}`);
        console.error('Make sure you\'re running this script from the demos/ directory');
        process.exit(1);
    }

    if (!fs.existsSync(jsonFile)) {
        console.error(`❌ JSON file not found: ${jsonFile}`);
        console.error('Make sure you\'re running this script from the demos/ directory');
        process.exit(1);
    }

    // Parse CSV file
    printHeader('CSV DATA FILE PARSING');
    console.log('\n');
    const csvData = parseCSV(csvFile);
    displayIterations(csvData, 'CSV', csvFile);
    console.log('\n💡 KEY INSIGHT: CSV has NO \'name\' field - it will be undefined in pm.iterationData\n');

    // Parse JSON file
    printHeader('JSON DATA FILE PARSING');
    console.log('\n');
    const jsonData = parseJSON(jsonFile);
    displayIterations(jsonData, 'JSON', jsonFile);
    console.log('\n💡 KEY INSIGHT: JSON HAS \'name\' field - this enables data source detection!\n');

    // Display insights
    displayKeyInsights(csvData, jsonData);

    // Display comparison
    console.log('\n');
    displayComparison();

    // Next steps
    printHeader('NEXT STEPS');
    console.log('\n1. Run simulate-iterations.js to see how Newman uses these iterations');
    console.log('2. Run compare-csv-json.js to see side-by-side execution comparison');
    console.log('3. Practice explaining this mechanism in English for your interview!\n');

    printSeparator('=');
    console.log('✅ Parsing demonstration complete!\n');
}

// Run the script
if (require.main === module) {
    main();
}

// Export functions for testing
module.exports = {
    parseCSV,
    parseJSON,
    displayIterations
};
