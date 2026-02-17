# Postman/Newman Data Parsing Demonstration Scripts

Educational Node.js scripts to help understand how CSV and JSON data files work with Postman/Newman data-driven testing.

## Purpose

These scripts demonstrate the mechanism behind Newman's data-driven testing **without requiring Newman or Postman installation**. They help you understand:
- How CSV rows become iterations
- How JSON objects become iterations
- How `pm.iterationData.get()` works
- Variable substitution with `{{placeholders}}`
- The "Universal Test" pattern for data source detection

Perfect for **interview preparation** - understand the concepts deeply and explain them confidently!

---

## Quick Start

```bash
# Navigate to the demos directory
cd demos

# Script 1: See how data files are parsed
node parse-data-files.js

# Script 2: See iteration mechanism in action (CSV by default)
node simulate-iterations.js

# Script 2b: Run with JSON data
node simulate-iterations.js json

# Script 3: Side-by-side comparison
node compare-csv-json.js
```

---

## Scripts Overview

### Script 1: `parse-data-files.js`
**What it does:** Shows how CSV and JSON files are parsed into iteration objects

**What you'll learn:**
- CSV structure (header row + data rows)
- JSON structure (array of objects)
- Field differences (CSV has 4 fields, JSON has 5)
- Why CSV has no 'name' field (key for detection)
- Iteration count calculation

**Output highlights:**
- Formatted tables showing each iteration's data
- Side-by-side field comparison
- Key insights about data structures

**Run time:** ~5 seconds

**Interview prep:** Practice explaining: "CSV rows become iterations, JSON objects become iterations"

---

### Script 2: `simulate-iterations.js`
**What it does:** Simulates Newman's iteration mechanism with variable substitution

**What you'll learn:**
- How Newman loops through iterations
- Pre-request script execution
- Variable substitution (`{{username}}` → `"testuser1"`)
- Request body population
- Test script execution
- The "Universal Test" pattern
- Handling undefined variables gracefully

**Output highlights:**
- Detailed iteration 1 execution (all 3 requests)
- Variable substitution step-by-step
- Data source detection demonstration
- Summary of all 5 iterations

**Usage:**
```bash
node simulate-iterations.js      # Run with CSV (default)
node simulate-iterations.js json  # Run with JSON
```

**Run time:** ~10 seconds

**Interview prep:** Practice explaining: "ALL requests run for EVERY iteration, regardless of data file type"

---

### Script 3: `compare-csv-json.js`
**What it does:** Side-by-side comparison of CSV vs JSON execution

**What you'll learn:**
- High-level execution comparison
- Iteration 1 data differences
- Request body differences for each request type
- Why total request count is the same (15 for both)
- When to use CSV vs JSON in real projects
- Interview answer templates

**Output highlights:**
- Comparison tables
- Side-by-side request bodies
- Key takeaways
- Real-world usage guide
- Interview answer template

**Run time:** ~10 seconds

**Interview prep:** Use the interview answer template verbatim!

---

## Learning Progression

### Phase 1: Understand Data Structures (Script 1)
1. Run `parse-data-files.js`
2. Study the formatted tables
3. Note which fields are present in CSV vs JSON
4. Understand: CSV has 4 fields, JSON has 5 (adds 'name')

**Key Question:** Why does JSON have an extra 'name' field?
**Answer:** To demonstrate data source detection and flexible collection design

---

### Phase 2: See Iteration Mechanism (Script 2)
1. Run `simulate-iterations.js` (CSV)
2. Observe how iteration 1 executes all 3 requests
3. Note variable substitution process
4. Run `simulate-iterations.js json`
5. Compare output - see how 'name' field is populated

**Key Question:** Do all requests run regardless of data file?
**Answer:** YES! All 3 requests run for every iteration with both CSV and JSON

---

### Phase 3: Compare and Synthesize (Script 3)
1. Run `compare-csv-json.js`
2. Study the side-by-side comparisons
3. Read the "Interview Answer Template" section
4. Review "Real-World Usage Guide"
5. Practice explaining the concepts out loud

**Key Question:** When would you use CSV vs JSON?
**Answer:** CSV for simple data (1000+ rows), JSON for complex nested structures

---

## Key Concepts Explained

### pm.iterationData.get() API

This is how test scripts access data from the current iteration:

```javascript
// Works identically for CSV and JSON:
const username = pm.iterationData.get('username');
const email = pm.iterationData.get('email');
const name = pm.iterationData.get('name');  // undefined for CSV, "John Doe" for JSON
```

**Key Points:**
- Same API for both formats
- Returns `undefined` for missing fields (no errors)
- CSV: 'name' is undefined
- JSON: 'name' has a value

---

### Variable Substitution with {{}}

Request body templates use `{{variableName}}` placeholders:

```json
{
    "username": "{{username}}",
    "email": "{{email}}",
    "name": "{{name}}"
}
```

**With CSV (testuser1):**
```json
{
    "username": "testuser1",
    "email": "testuser1@example.com",
    "name": ""  ← Empty string (not in CSV)
}
```

**With JSON (johndoe):**
```json
{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "name": "John Doe"  ← Actual value
}
```

---

### Universal Test Pattern (Smart Detection)

Detect which data source is being used:

```javascript
// In test script:
const name = pm.iterationData.get('name');
const dataSource = name ? 'JSON' : 'CSV';

console.log(`📂 Data source: ${dataSource} file`);

pm.test(`✓ [${dataSource}] Response received`, function () {
    pm.expect(pm.response.code).to.equal(201);
});
```

**Output with CSV:** `✓ [CSV] Response received`
**Output with JSON:** `✓ [JSON] Response received`

**Why this matters:** Makes collections flexible - same code works with both formats!

---

## Common Questions

### Q1: "Can Newman run both CSV and JSON simultaneously?"
**A:** NO. Newman accepts ONE data file per execution via the `-d` flag.

```bash
# ❌ WRONG - Can't use multiple -d flags
newman run collection.json -d file1.csv -d file2.json

# ✅ RIGHT - Run separately
newman run collection.json -d file1.csv
newman run collection.json -d file2.json
```

---

### Q2: "Do all requests run with both data files?"
**A:** YES! ALL requests in the collection execute for EVERY iteration, regardless of which data file you use.

- Collection has 3 request groups
- CSV: 5 iterations × 3 requests = 15 total
- JSON: 5 iterations × 3 requests = 15 total

---

### Q3: "What happens when CSV data is used with JSON-specific requests?"
**A:** The request still executes. Variables not in CSV (like `name`) become empty strings. No errors thrown.

```javascript
// Request 2 uses {{name}}
// With CSV: name = "" (empty string)
// With JSON: name = "John Doe" (actual value)
```

---

### Q4: "Why have separate CSV-optimized and JSON-optimized requests?"
**A:** For demonstration and learning! In production, you'd typically use the "Universal" approach that works with both.

---

### Q5: "How do I know which data file was used?"
**A:** Implement data source detection by checking for format-specific fields:

```javascript
const name = pm.iterationData.get('name');
const dataSource = name ? 'JSON' : 'CSV';
```

---

## Technical Requirements

- **Node.js**: Version 14 or higher
- **Dependencies**: None (uses only built-in modules: `fs`, `path`)
- **Installation**: No npm install required!

---

## Troubleshooting

### Error: "Data file not found"
**Solution:** Make sure you're running the scripts from the `demos/` directory:
```bash
cd demos
node parse-data-files.js
```

### Error: "Cannot read property..."
**Solution:** Check that the data files exist in `../fixtures/`:
```bash
ls ../fixtures/
# Should show: test-data.csv test-users.json
```

---

## Interview Preparation Tips

### 1. Run All Scripts Multiple Times
- First run: Understand the output
- Second run: Focus on specific sections
- Third run: Practice explaining each step out loud

### 2. Practice the Interview Answer Template
Script 3 (`compare-csv-json.js`) includes a complete interview answer. Practice saying it naturally.

### 3. Key Phrases to Master
- "Newman parses the data file into iterations"
- "pm.iterationData.get() provides access to current iteration data"
- "Variable substitution replaces placeholders before sending requests"
- "The same collection works with both formats - just swap the data file"
- "Universal test pattern detects data source by checking format-specific fields"

### 4. Quantifiable Metrics to Mention
- "5 iterations times 3 requests equals 15 total requests"
- "CSV has 4 fields, JSON has 5 fields"
- "Collection execution takes ~5 seconds for 15 requests"
- "Response time averaging 300ms per request"

### 5. Be Ready to Explain
- Why all requests run regardless of data file
- How undefined variables are handled
- When to use CSV vs JSON in production
- How to integrate this in CI/CD pipelines

---

## Real-World Application

### Use CSV for:
✅ Smoke tests (10-50 simple scenarios)
✅ Regression suites (1000+ test cases)
✅ Data from databases or Excel
✅ Non-technical team collaboration
✅ Simple, flat data structures

### Use JSON for:
✅ Complex nested payloads
✅ Dynamic data (timestamps, UUIDs)
✅ Realistic API responses
✅ Integration tests
✅ Chaining requests

### Use Universal Pattern for:
✅ Core test suites
✅ Shared collections across teams
✅ CI/CD pipelines with multiple data sources

---

## Next Steps

1. **Run all three scripts** to build complete understanding
2. **Study the console output** - it's designed to be educational
3. **Practice explaining concepts** in English (record yourself!)
4. **Run real Newman commands** (see verification section in Script 3)
5. **Review POSTMAN-DATA-MECHANISM.md** (comprehensive written guide)
6. **Prepare portfolio** - these scripts show deep understanding!

---

## Verification with Real Newman

After understanding the mechanism with these scripts, verify with real Newman:

```bash
cd ..  # Go back to day-03-postman-api directory

# Run with CSV
newman run 04-postman-data-driven-collection-fixed.json \
    -d fixtures/test-data.csv \
    -r cli

# Run with JSON
newman run 04-postman-data-driven-collection-fixed.json \
    -d fixtures/test-users.json \
    -r cli

# Compare outputs - notice the same patterns!
```

---

## Files in This Directory

```
demos/
├── README.md                    ← You are here
├── parse-data-files.js          ← Script 1: Data parsing
├── simulate-iterations.js       ← Script 2: Iteration simulation
├── compare-csv-json.js          ← Script 3: Side-by-side comparison
└── package.json                 ← Optional npm scripts
```

---

## Success Criteria

You're ready for the interview when you can:

- [ ] Explain how CSV rows become iterations
- [ ] Explain how JSON objects become iterations
- [ ] Describe `pm.iterationData.get()` behavior
- [ ] Show variable substitution process
- [ ] Explain why all requests run regardless of data file
- [ ] Demonstrate the Universal Test pattern
- [ ] Confidently answer "When would you use CSV vs JSON?"
- [ ] Explain this mechanism in 2-3 minutes in fluent English

---

## Additional Resources

- **POSTMAN-DATA-MECHANISM.md** - Full written documentation (349 lines)
- **START-HERE.md** - Quick overview and decision tree (265 lines)
- **04-postman-data-driven-collection-fixed.json** - The actual collection
- **fixtures/test-data.csv** - CSV test data (5 rows, 4 fields)
- **fixtures/test-users.json** - JSON test data (5 objects, 5 fields)

---

## Feedback

These scripts were created for BASF QA Automation Engineer interview preparation. They demonstrate deep understanding of data-driven testing concepts.

**Time to complete all scripts:** 30-40 minutes
**Interview readiness:** After running all scripts and practicing explanations

Good luck with your interview! 🚀

---

## License

MIT - Educational purposes, BASF interview preparation
