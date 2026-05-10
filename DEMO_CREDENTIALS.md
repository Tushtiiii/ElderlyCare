# Demo Credentials for Elderly Care Application

This document lists all demo accounts created for testing the application.

## Demo Accounts

### 1. Elder (Patient)

```
Name: John Anderson
Email: elder.demo@example.com
Password: DemoPass@123
Phone: +1234567890
Date of Birth: 1950-05-15
Role: ELDER
```

### 2. Guardian (Child/Caregiver)

```
Name: Sarah Anderson
Email: guardian.demo@example.com
Password: DemoPass@123
Phone: +1234567891
Date of Birth: 1975-08-20
Role: CHILD
```

### 3. Doctor

```
Name: Dr. Michael Smith
Email: doctor.demo@example.com
Password: DemoPass@123
Phone: +1234567892
Date of Birth: 1970-03-10
Role: DOCTOR
```

### 4. Pathologist

```
Name: Dr. Emily Johnson
Email: pathologist.demo@example.com
Password: DemoPass@123
Phone: +1234567893
Date of Birth: 1972-11-25
Role: PATHOLOGIST
```

## How to Create Demo Accounts

### Option 1: Direct Database Insertion (PostgreSQL)

Run the seed SQL file to insert demo data directly:

```bash
psql -U postgres -d elderly_care_db -f demo-seed.sql
```

### Option 2: Using cURL Commands

Run the registration script to create accounts via API:

```bash
./register-demo-users.sh
```

Or run individual curl commands:

```bash
# Register Elder
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Anderson",
    "email": "elder.demo@example.com",
    "password": "DemoPass@123",
    "phone": "+1234567890",
    "role": "ELDER",
    "dateOfBirth": "1950-05-15"
  }'

# Register Guardian
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Anderson",
    "email": "guardian.demo@example.com",
    "password": "DemoPass@123",
    "phone": "+1234567891",
    "role": "CHILD",
    "dateOfBirth": "1975-08-20"
  }'

# Register Doctor
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Michael Smith",
    "email": "doctor.demo@example.com",
    "password": "DemoPass@123",
    "phone": "+1234567892",
    "role": "DOCTOR",
    "dateOfBirth": "1970-03-10"
  }'

# Register Pathologist
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Emily Johnson",
    "email": "pathologist.demo@example.com",
    "password": "DemoPass@123",
    "phone": "+1234567893",
    "role": "PATHOLOGIST",
    "dateOfBirth": "1972-11-25"
  }'
```

### Option 3: Login to Get Auth Token

After creating the accounts, you can login to get a JWT token:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "elder.demo@example.com",
    "password": "DemoPass@123"
  }'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Anderson",
  "email": "elder.demo@example.com",
  "role": "ELDER",
  "expiresIn": 86400000
}
```

Use the token for authenticated requests:

```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Testing Workflows

### Workflow 1: Guardian Monitoring Elder

1. Login as Guardian (sarah.anderson@example.com)
2. Send a monitoring request to Elder (john.anderson@example.com)
3. Login as Elder and approve the request
4. Guardian can now view Elder's vitals, medications, and lab reports

### Workflow 2: Doctor Accessing Patient Data

1. Login as Doctor (michael.smith@example.com)
2. Request access to Elder's care data using care code
3. Upload medical notes or prescriptions
4. Doctor can view and manage patient health data

### Workflow 3: Pathologist Submitting Lab Reports

1. Login as Pathologist (emily.johnson@example.com)
2. Request access to Elder's records
3. Upload lab test reports with results
4. Guardian and Doctor can view the uploaded reports

## Database Connection

```
Host: localhost
Port: 5432
Database: elderly_care_db
Username: postgres
Password: root@123
```

## API Base URL

```
http://localhost:8080
```

## Notes

- All demo passwords are: `DemoPass@123`
- All phone numbers are unique and required for the system
- Dates of birth are provided for Elder and Doctor roles
- The system supports Google OAuth login as well
