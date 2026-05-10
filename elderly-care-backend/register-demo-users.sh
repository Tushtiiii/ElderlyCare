#!/bin/bash

# ============================================================================= # Demo Account Registration Script
# Elderly Care System
# 
# This script registers demo accounts for all system roles via REST API
# Make sure the backend is running on http://localhost:8080
# ============================================================================= 
set -e

# Configuration
API_URL="${API_URL:-http://localhost:8080}"
TIMEOUT=10

echo "🏥 Elderly Care - Demo Account Registration"
echo "=========================================="
echo "API URL: $API_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if backend is running
check_backend() {
    echo "Checking if backend is running..."
    if ! curl -s --connect-timeout 2 "$API_URL/api/auth/login" > /dev/null 2>&1; then
        echo -e "${RED}✗ Backend is not running at $API_URL${NC}"
        echo "Please start the backend first:"
        echo "  cd elderly-care-backend"
        echo "  mvn spring-boot:run"
        exit 1
    fi
    echo -e "${GREEN}✓ Backend is running${NC}"
    echo ""
}

# Function to register a user
register_user() {
    local name=$1
    local email=$2
    local password=$3
    local phone=$4
    local role=$5
    local dob=$6
    
    echo "Registering $role: $name ($email)..."
    
    response=$(curl -s -X POST "$API_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d @- << EOF
{
  "name": "$name",
  "email": "$email",
  "password": "$password",
  "phone": "$phone",
  "role": "$role",
  "dateOfBirth": "$dob"
}
EOF
    )
    
    # Check if registration was successful
    if echo "$response" | grep -q '"token"'; then
        user_id=$(echo "$response" | grep -o '"userId":"[^"]*' | cut -d'"' -f4)
        echo -e "${GREEN}✓ Registered successfully (ID: $user_id)${NC}"
        echo "  Token received: $(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4 | cut -c1-50)..."
        echo ""
        return 0
    else
        error_msg=$(echo "$response" | grep -o '"message":"[^"]*' | head -1 | cut -d'"' -f4)
        if [ -z "$error_msg" ]; then
            error_msg=$response
        fi
        echo -e "${YELLOW}⚠ Registration failed: $error_msg${NC}"
        echo ""
        return 1
    fi
}

# Check if backend is running
check_backend

# Register all demo accounts
echo "📝 Creating demo accounts..."
echo ""

# 1. ELDER
register_user \
    "John Anderson" \
    "elder.demo@example.com" \
    "DemoPass@123" \
    "+1234567890" \
    "ELDER" \
    "1950-05-15"

# 2. GUARDIAN/CHILD
register_user \
    "Sarah Anderson" \
    "guardian.demo@example.com" \
    "DemoPass@123" \
    "+1234567891" \
    "CHILD" \
    "1975-08-20"

# 3. DOCTOR
register_user \
    "Dr. Michael Smith" \
    "doctor.demo@example.com" \
    "DemoPass@123" \
    "+1234567892" \
    "DOCTOR" \
    "1970-03-10"

# 4. PATHOLOGIST
register_user \
    "Dr. Emily Johnson" \
    "pathologist.demo@example.com" \
    "DemoPass@123" \
    "+1234567893" \
    "PATHOLOGIST" \
    "1972-11-25"

echo "=========================================="
echo -e "${GREEN}✓ Demo account setup complete!${NC}"
echo ""
echo "You can now login with these credentials:"
echo ""
echo "  ELDER:        elder.demo@example.com / DemoPass@123"
echo "  GUARDIAN:     guardian.demo@example.com / DemoPass@123"
echo "  DOCTOR:       doctor.demo@example.com / DemoPass@123"
echo "  PATHOLOGIST:  pathologist.demo@example.com / DemoPass@123"
echo ""
echo "See DEMO_CREDENTIALS.md for more details."
