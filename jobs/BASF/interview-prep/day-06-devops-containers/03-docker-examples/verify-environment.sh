#!/bin/bash

# ============================================
# Docker Environment Verification Script
# ============================================
# This script verifies the Docker testing environment step by step

set -e  # Exit on error

echo "============================================"
echo "Docker Testing Environment Verification"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# Step 1: Check Prerequisites
# ============================================
echo "Step 1: Checking prerequisites..."
echo ""

# Check Docker
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker is installed$(docker --version)${NC}"
else
    echo -e "${RED}✗ Docker is not installed${NC}"
    exit 1
fi

# Check Docker Compose
if docker compose version &> /dev/null; then
    echo -e "${GREEN}✓ Docker Compose is installed ($(docker compose version))${NC}"
elif command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ Docker Compose is installed ($(docker-compose --version))${NC}"
    COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    exit 1
fi

# Set compose command
COMPOSE_CMD="${COMPOSE_CMD:-docker compose}"

echo ""

# ============================================
# Step 2: Check File Structure
# ============================================
echo "Step 2: Verifying file structure..."
echo ""

required_files=(
    "docker-compose.yml"
    "Dockerfile.cypress"
    "Dockerfile.newman"
    "app/Dockerfile"
    "app/package.json"
    "app/server.js"
    "db-init/init.sql"
    "cypress/e2e/api-tests.cy.js"
    "cypress.config.js"
    "collections/API-Collection.json"
    "environments/docker-compose-env.json"
    "package.json"
)

missing_files=0
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ Missing: $file${NC}"
        ((missing_files++))
    fi
done

if [ $missing_files -gt 0 ]; then
    echo -e "${RED}Error: $missing_files required files are missing${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All required files present${NC}"
echo ""

# ============================================
# Step 3: Create Test Results Directories
# ============================================
echo "Step 3: Creating test results directories..."
echo ""

mkdir -p test-results/cypress/{videos,screenshots,results}
mkdir -p test-results/newman
chmod -R 777 test-results/

echo -e "${GREEN}✓ Test results directories created${NC}"
echo ""

# ============================================
# Step 4: Start Services
# ============================================
echo "Step 4: Starting services..."
echo ""
echo -e "${YELLOW}This will download Docker images (first time only, may take 5-10 minutes)${NC}"
echo ""

$COMPOSE_CMD up -d database redis web-app

echo ""
echo -e "${YELLOW}Waiting for services to be healthy (30 seconds)...${NC}"
sleep 30

# ============================================
# Step 5: Check Service Health
# ============================================
echo ""
echo "Step 5: Checking service health..."
echo ""

# Check if containers are running
if docker ps | grep -q basf-postgres; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${RED}✗ PostgreSQL is not running${NC}"
    $COMPOSE_CMD logs database | tail -20
    exit 1
fi

if docker ps | grep -q basf-redis; then
    echo -e "${GREEN}✓ Redis is running${NC}"
else
    echo -e "${RED}✗ Redis is not running${NC}"
    $COMPOSE_CMD logs redis | tail -20
    exit 1
fi

if docker ps | grep -q basf-web-app; then
    echo -e "${GREEN}✓ Web app is running${NC}"
else
    echo -e "${RED}✗ Web app is not running${NC}"
    $COMPOSE_CMD logs web-app | tail -20
    exit 1
fi

echo ""

# ============================================
# Step 6: Test Application Endpoints
# ============================================
echo "Step 6: Testing application endpoints..."
echo ""

# Test health endpoint
if curl -s http://localhost:3000/health | grep -q "healthy"; then
    echo -e "${GREEN}✓ Health endpoint working${NC}"
else
    echo -e "${RED}✗ Health endpoint not responding${NC}"
    exit 1
fi

# Test users API
if curl -s http://localhost:3000/api/users | grep -q "success"; then
    echo -e "${GREEN}✓ Users API working${NC}"
else
    echo -e "${RED}✗ Users API not responding${NC}"
    exit 1
fi

echo ""

# ============================================
# Step 7: Run Cypress Tests
# ============================================
echo "Step 7: Running Cypress tests..."
echo ""

$COMPOSE_CMD up --exit-code-from cypress-tests cypress-tests

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Cypress tests passed${NC}"
else
    echo -e "${RED}✗ Cypress tests failed${NC}"
fi

echo ""

# ============================================
# Step 8: Run Newman Tests
# ============================================
echo "Step 8: Running Newman API tests..."
echo ""

$COMPOSE_CMD up --exit-code-from newman-tests newman-tests

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Newman tests passed${NC}"
else
    echo -e "${RED}✗ Newman tests failed${NC}"
fi

echo ""

# ============================================
# Step 9: Show Test Results
# ============================================
echo "Step 9: Test results location..."
echo ""

if [ -d "test-results/cypress/videos" ] && [ "$(ls -A test-results/cypress/videos)" ]; then
    echo -e "${GREEN}✓ Cypress videos: test-results/cypress/videos/${NC}"
    ls -lh test-results/cypress/videos/
fi

if [ -f "test-results/newman/newman-report.html" ]; then
    echo -e "${GREEN}✓ Newman report: test-results/newman/newman-report.html${NC}"
fi

echo ""

# ============================================
# Step 10: Summary
# ============================================
echo "============================================"
echo "Verification Complete!"
echo "============================================"
echo ""
echo "Environment Status:"
$COMPOSE_CMD ps
echo ""

echo "To view logs:"
echo "  $COMPOSE_CMD logs web-app"
echo "  $COMPOSE_CMD logs database"
echo "  $COMPOSE_CMD logs redis"
echo ""

echo "To stop services:"
echo "  $COMPOSE_CMD down"
echo ""

echo "To cleanup everything:"
echo "  $COMPOSE_CMD down -v"
echo "  rm -rf test-results/"
echo ""

echo -e "${GREEN}✓ All verification steps completed successfully!${NC}"
