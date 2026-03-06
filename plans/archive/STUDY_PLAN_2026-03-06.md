# Study Plan - 2026-03-06

**Topic**: File IO - Python 文件操作
**Duration**: 1 hour
**Goal**: Master file operations for interviews (15 questions: #166-180)

---

## Schedule

| Time | Content | Duration |
|------|---------|----------|
| 0-15 min | Basic file operations (open/read/write) | 15 min |
| 15-30 min | File formats (CSV, JSON) | 15 min |
| 30-45 min | Advanced operations (binary, compression, pathlib) | 15 min |
| 45-60 min | Interview questions + summary | 15 min |

---

## Part 1: Basic File Operations (15 min)

### File Open Modes

```python
# Mode reference
'r'   # Read (default)
'w'   # Write (overwrite)
'a'   # Append
'x'   # Exclusive create (fail if exists)
'b'   # Binary mode
'+'   # Read + Write

# Common combinations
'rb'  # Binary read
'wb'  # Binary write
'r+'  # Read/write
'a+'  # Read/append
```

### The Golden Rule: Use `with`

```python
# Always use context manager (auto-closes file)
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()
# File automatically closed here
```

### Reading Methods

```python
# Read entire file
content = f.read()

# Read specific bytes
chunk = f.read(100)

# Read one line
line = f.readline()

# Read all lines to list
lines = f.readlines()

# Best for large files: iterate
for line in f:
    print(line.strip())
```

### Writing Methods

```python
# Write string
f.write('Hello\n')

# Write multiple lines
f.writelines(['line1\n', 'line2\n'])

# Using print
print('Hello', file=f)
```

### File Position

```python
f.tell()      # Current position
f.seek(0)     # Go to beginning
f.seek(0, 2)  # Go to end
```

---

## Part 2: File Formats (15 min)

### CSV Files

```python
import csv

# Read CSV
with open('data.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)  # row is a list

# Read as dict (uses header row as keys)
with open('data.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row['name'], row['age'])

# Write CSV
with open('output.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['name', 'age'])  # header
    writer.writerows([['Alice', 25], ['Bob', 30]])

# Write dict
with open('output.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'age'])
    writer.writeheader()
    writer.writerow({'name': 'Alice', 'age': 25})
```

### JSON Files

```python
import json

# Read JSON
with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Write JSON (pretty print)
with open('output.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# String conversion
json_str = json.dumps(data)  # dict -> string
data = json.loads(json_str)  # string -> dict
```

### Key Difference: load vs loads

| Function | Input | Output |
|----------|-------|--------|
| `json.load(f)` | File object | Python dict |
| `json.loads(s)` | String | Python dict |
| `json.dump(d, f)` | Dict + File | Write to file |
| `json.dumps(d)` | Dict | JSON string |

---

## Part 3: Advanced Operations (15 min)

### pathlib (Modern Python)

```python
from pathlib import Path

p = Path('folder/file.txt')

# Properties
p.name        # 'file.txt'
p.stem        # 'file'
p.suffix      # '.txt'
p.parent      # Path('folder')

# Operations
p.exists()
p.is_file()
p.is_dir()

# Read/Write
content = p.read_text(encoding='utf-8')
p.write_text('content', encoding='utf-8')

# Find files
list(Path('.').glob('*.py'))        # Current dir
list(Path('.').rglob('*.py'))       # Recursive

# Join paths
new_path = Path('folder') / 'subdir' / 'file.txt'
```

### os and shutil

```python
import os
import shutil

# Check existence
os.path.exists('file.txt')
os.path.isfile('file.txt')
os.path.isdir('folder')

# Path manipulation
os.path.join('a', 'b', 'c')      # 'a/b/c'
os.path.basename('/a/b/file.txt')  # 'file.txt'
os.path.dirname('/a/b/file.txt')   # '/a/b'
os.path.splitext('file.txt')       # ('file', '.txt')

# Directory operations
os.makedirs('path/to/dir', exist_ok=True)
os.listdir('.')

# File operations
shutil.copy('src', 'dst')        # Copy file
shutil.copytree('src', 'dst')    # Copy directory
shutil.move('src', 'dst')        # Move
shutil.rmtree('folder')          # Delete directory tree
```

### Compression

```python
import zipfile

# Create ZIP
with zipfile.ZipFile('archive.zip', 'w') as zf:
    zf.write('file.txt')

# Extract ZIP
with zipfile.ZipFile('archive.zip', 'r') as zf:
    zf.extractall('output_folder')
    # or list contents
    print(zf.namelist())
```

### Temporary Files

```python
import tempfile

# Auto-deleted temp file
with tempfile.NamedTemporaryFile(mode='w', delete=False) as f:
    f.write('temp data')
    temp_path = f.name

# Auto-deleted temp directory
with tempfile.TemporaryDirectory() as tmpdir:
    # Use tmpdir
    pass
# Directory deleted when exiting with block
```

---

## Part 4: Interview Questions (15 min)

### Q1: How to read a large file efficiently?

```python
# DON'T: Load entire file into memory
content = f.read()  # Bad for large files

# DO: Iterate line by line
with open('large.txt', 'r') as f:
    for line in f:
        process(line)

# DO: Read in chunks
def read_chunks(file_path, chunk_size=8192):
    with open(file_path, 'r') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            yield chunk
```

### Q2: Difference between `read()`, `readline()`, `readlines()`?

| Method | Returns | Memory | Use Case |
|--------|---------|--------|----------|
| `read()` | Entire file as string | High | Small files |
| `readline()` | One line | Low | Process line by line |
| `readlines()` | List of all lines | High | Need all lines as list |
| `for line in f:` | Iterator | Low | Large files (best) |

### Q3: How to handle encoding errors?

```python
# Detect encoding
import chardet
with open('file.txt', 'rb') as f:
    result = chardet.detect(f.read())
    encoding = result['encoding']

# Handle errors
with open('file.txt', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# errors options: 'ignore', 'replace', 'backslashreplace'
```

### Q4: When to use `json.load()` vs `json.loads()`?

```python
# load() - from FILE
with open('data.json') as f:
    data = json.load(f)

# loads() - from STRING
data = json.loads('{"name": "Alice"}')

# Same for dump/dumps
json.dump(data, file_obj)   # Write to file
json_str = json.dumps(data) # Return string
```

### Q5: How to safely write files (atomic write)?

```python
import tempfile
import os

def safe_write(file_path, content):
    # Write to temp file first
    dir_name = os.path.dirname(file_path)
    fd, temp_path = tempfile.mkstemp(dir=dir_name)
    try:
        with os.fdopen(fd, 'w') as f:
            f.write(content)
        # Atomic replace
        os.replace(temp_path, file_path)
    except:
        os.unlink(temp_path)
        raise
```

---

## Quick Reference

```python
# Basic read/write
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()

with open('file.txt', 'w', encoding='utf-8') as f:
    f.write('content')

# CSV
reader = csv.reader(f)
reader = csv.DictReader(f)
writer = csv.writer(f)
writer = csv.DictWriter(f, fieldnames=['a', 'b'])

# JSON
data = json.load(f)      # file -> dict
json.dump(data, f)       # dict -> file
data = json.loads(s)     # string -> dict
s = json.dumps(data)     # dict -> string

# pathlib
p = Path('file.txt')
p.read_text() / p.write_text('content')
p.exists() / p.is_file() / p.is_dir()
list(Path('.').rglob('*.py'))

# os.path
os.path.join('a', 'b')
os.path.exists('file')
os.path.basename / dirname / splitext
```

---

## Checklist

- [ ] Can open/read/write files with context manager
- [ ] Know all file modes (r, w, a, x, b, +)
- [ ] Can read/write CSV files (reader, DictReader, writer)
- [ ] Can read/write JSON files (load/loads, dump/dumps)
- [ ] Know pathlib basics (Path, glob, rglob)
- [ ] Can handle encoding issues
- [ ] Can answer 5 interview questions

---

## After Today

You've completed File IO basics. Next suggestions:
- [ ] Practice with real files (CSV data analysis, JSON config)
- [ ] Study 09-模块与包.md (Modules and packages)
- [ ] Study 10-迭代器与生成器.md (Iterators and generators)
