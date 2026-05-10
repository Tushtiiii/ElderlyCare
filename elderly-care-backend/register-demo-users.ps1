# ============================================================================= # Demo Account Registration Script (PowerShell for Windows)
# Elderly Care System
# 
# This script registers demo accounts for all system roles via REST API
# Make sure the backend is running on http://localhost:8080
# ============================================================================= 

param(
    [string]$ApiUrl = "http://localhost:8080"
)

Write-Host "🏥 Elderly Care - Demo Account Registration" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "API URL: $ApiUrl" -ForegroundColor Cyan
Write-Host ""

# Function to check if backend is running
function Test-Backend {
    Write-Host "Checking if backend is running..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$ApiUrl/api/auth/login" -Method POST -TimeoutSec 2 -ErrorAction SilentlyContinue
        Write-Host "✓ Backend is running" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Backend is not running at $ApiUrl" -ForegroundColor Red
        Write-Host "Please start the backend first:"
        Write-Host "  cd elderly-care-backend"
        Write-Host "  mvn spring-boot:run"
        return $false
    }
}

# Function to register a user
function Register-User {
    param(
        [string]$Name,
        [string]$Email,
        [string]$Password,
        [string]$Phone,
        [string]$Role,
        [string]$DateOfBirth
    )
    
    Write-Host "Registering $Role : $Name ($Email)..." -ForegroundColor Cyan
    
    $body = @{
        name = $Name
        email = $Email
        password = $Password
        phone = $Phone
        role = $Role
        dateOfBirth = $DateOfBirth
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$ApiUrl/api/auth/register" `
            -Method POST `
            -Headers @{"Content-Type" = "application/json"} `
            -Body $body `
            -TimeoutSec 10
        
        $result = $response.Content | ConvertFrom-Json
        
        if ($result.token) {
            Write-Host "✓ Registered successfully (ID: $($result.userId))" -ForegroundColor Green
            Write-Host "  Token: $($result.token.Substring(0, 50))..." -ForegroundColor DarkGreen
            Write-Host ""
            return $true
        }
        else {
            Write-Host "⚠ Registration failed" -ForegroundColor Yellow
            Write-Host "  Response: $($response.Content)" -ForegroundColor Yellow
            Write-Host ""
            return $false
        }
    }
    catch {
        $errorMessage = $_.Exception.Message
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            $errorMessage = $errorBody | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($errorMessage.message) {
                $errorMessage = $errorMessage.message
            }
        }
        Write-Host "⚠ Registration failed: $errorMessage" -ForegroundColor Yellow
        Write-Host ""
        return $false
    }
}

# Check if backend is running
if (-not (Test-Backend)) {
    exit 1
}

Write-Host ""
Write-Host "📝 Creating demo accounts..." -ForegroundColor Yellow
Write-Host ""

# 1. ELDER
Register-User `
    -Name "John Anderson" `
    -Email "elder.demo@example.com" `
    -Password "DemoPass@123" `
    -Phone "+1234567890" `
    -Role "ELDER" `
    -DateOfBirth "1950-05-15"

# 2. GUARDIAN/CHILD
Register-User `
    -Name "Sarah Anderson" `
    -Email "guardian.demo@example.com" `
    -Password "DemoPass@123" `
    -Phone "+1234567891" `
    -Role "CHILD" `
    -DateOfBirth "1975-08-20"

# 3. DOCTOR
Register-User `
    -Name "Dr. Michael Smith" `
    -Email "doctor.demo@example.com" `
    -Password "DemoPass@123" `
    -Phone "+1234567892" `
    -Role "DOCTOR" `
    -DateOfBirth "1970-03-10"

# 4. PATHOLOGIST
Register-User `
    -Name "Dr. Emily Johnson" `
    -Email "pathologist.demo@example.com" `
    -Password "DemoPass@123" `
    -Phone "+1234567893" `
    -Role "PATHOLOGIST" `
    -DateOfBirth "1972-11-25"

Write-Host "==========================================" -ForegroundColor Green
Write-Host "✓ Demo account setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now login with these credentials:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ELDER:        elder.demo@example.com / DemoPass@123" -ForegroundColor White
Write-Host "  GUARDIAN:     guardian.demo@example.com / DemoPass@123" -ForegroundColor White
Write-Host "  DOCTOR:       doctor.demo@example.com / DemoPass@123" -ForegroundColor White
Write-Host "  PATHOLOGIST:  pathologist.demo@example.com / DemoPass@123" -ForegroundColor White
Write-Host ""
Write-Host "See DEMO_CREDENTIALS.md for more details." -ForegroundColor Gray
