# Quick Start: Demo Accounts Setup Guide

## 📋 Summary

This guide helps you quickly set up and test all four user roles in the Elderly Care application:

- **ELDER** (Patient)
- **CHILD** (Guardian/Caregiver)
- **DOCTOR** (Healthcare Provider)
- **PATHOLOGIST** (Lab Specialist)

---

## 🚀 Quick Setup (Choose One Method)

### Method 1: Using PowerShell Script (Windows - Easiest)

```powershell
# Navigate to backend directory
cd elderly-care-backend

# Run the PowerShell script
.\register-demo-users.ps1

# Or specify a custom API URL
.\register-demo-users.ps1 -ApiUrl http://localhost:8080
```

### Method 2: Using Bash Script (Linux/Mac)

```bash
# Navigate to backend directory
cd elderly-care-backend

# Make script executable
chmod +x register-demo-users.sh

# Run the script
./register-demo-users.sh

# Or specify a custom API URL
API_URL=http://localhost:8080 ./register-demo-users.sh
```

### Method 3: Using SQL Seed File (Direct Database)

```bash
# Navigate to backend directory
cd elderly-care-backend

# Run SQL seed file
psql -U postgres -d elderly_care_db -f demo-seed.sql

# Or if using pgAdmin:
# 1. Open pgAdmin
# 2. Select elderly_care_db database
# 3. Click "Tools" → "Query Tool"
# 4. Open and run demo-seed.sql
```

### Method 4: Manual cURL Commands

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

---

## 📝 Demo Credentials

| Role            | Email                        | Password     | Phone       |
| --------------- | ---------------------------- | ------------ | ----------- |
| **ELDER**       | elder.demo@example.com       | DemoPass@123 | +1234567890 |
| **GUARDIAN**    | guardian.demo@example.com    | DemoPass@123 | +1234567891 |
| **DOCTOR**      | doctor.demo@example.com      | DemoPass@123 | +1234567892 |
| **PATHOLOGIST** | pathologist.demo@example.com | DemoPass@123 | +1234567893 |

---

## 🧪 Testing User Workflows

### Test 1: Guardian Monitoring Elder

1. **Login as Guardian** in the mobile app:
   - Email: `guardian.demo@example.com`
   - Password: `DemoPass@123`

2. **Add Elder as Monitored Person**:
   - Tap "Add Elder"
   - Enter Elder's email: `elder.demo@example.com`
   - Send request

3. **Approve as Elder**:
   - Login as Elder: `elder.demo@example.com`
   - View pending relationships
   - Approve Guardian's request

4. **View Elder's Data** as Guardian:
   - Now see Elder's vitals, medications, health status

### Test 2: Doctor Accessing Patient Records

1. **Login as Doctor**:
   - Email: `doctor.demo@example.com`
   - Password: `DemoPass@123`

2. **Request Access to Elder's Records**:
   - Use Elder's care code or email
   - Add Elder as a patient

3. **View and Update Patient Data**:
   - Add medical notes
   - View vitals history
   - Manage prescriptions

### Test 3: Pathologist Submitting Lab Reports

1. **Login as Pathologist**:
   - Email: `pathologist.demo@example.com`
   - Password: `DemoPass@123`

2. **Access Elder's Records**:
   - Request access to Elder
   - Upload lab test reports

3. **Share Results**:
   - Guardian and Doctor receive notifications
   - Results appear in Elder's health history

---

## 🔐 Login via API

```bash
# Get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "elder.demo@example.com",
    "password": "DemoPass@123"
  }'

# Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "tokenType": "Bearer",
#   "userId": "a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d",
#   "name": "John Anderson",
#   "email": "elder.demo@example.com",
#   "role": "ELDER",
#   "expiresIn": 86400000
# }

# Use token for authenticated requests
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📂 File Reference

| File                      | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `DEMO_CREDENTIALS.md`     | Detailed credentials and usage guide       |
| `demo-seed.sql`           | SQL script for direct database seeding     |
| `register-demo-users.sh`  | Bash script for Linux/Mac registration     |
| `register-demo-users.ps1` | PowerShell script for Windows registration |
| `QUICK_START.md`          | This file - quick reference                |

---

## ⚙️ Prerequisites

Before registering demo accounts, ensure:

1. **Backend is Running**:

   ```bash
   cd elderly-care-backend
   mvn spring-boot:run
   ```

2. **Database is Connected**:
   - PostgreSQL running on `localhost:5432`
   - Database `elderly_care_db` created
   - Default credentials: `postgres` / `root@123`

3. **Verify Database Connection**:
   ```bash
   psql -U postgres -d elderly_care_db -c "SELECT COUNT(*) FROM users;"
   ```

---

## 🛠️ Troubleshooting

### Script Execution Issues (PowerShell)

If you get execution policy errors:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\register-demo-users.ps1
```

### Backend Not Running

Error: `Connection refused`

```bash
cd elderly-care-backend
mvn spring-boot:run
```

### Database Connection Failed

Error: `FATAL: password authentication failed`

Check `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/elderly_care_db
spring.datasource.username=postgres
spring.datasource.password=root@123
```

### Duplicate Email Error

If you see: `Email is already registered`

Option 1: Delete existing demo users:

```sql
DELETE FROM users WHERE email IN (
  'elder.demo@example.com',
  'guardian.demo@example.com',
  'doctor.demo@example.com',
  'pathologist.demo@example.com'
);
```

Option 2: Use different email addresses in the scripts

---

## 📊 Verify Demo Accounts

### Via Database Query

```bash
psql -U postgres -d elderly_care_db << 'EOF'
SELECT id, name, email, role, is_active, created_at
FROM users
WHERE email LIKE '%.demo@example.com'
ORDER BY role;
EOF
```

### Via API

```bash
# Get your token first
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"elder.demo@example.com","password":"DemoPass@123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Get current user info
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💡 Next Steps

1. **Mobile App Testing**: Use the credentials to login to the Expo app
2. **Create Relationships**: Setup elder-guardian connections
3. **Add Health Data**: Record vitals, medications, lab reports
4. **Test Notifications**: Verify alert system with multiple roles
5. **API Integration**: Use Postman or Thunder Client with JWT tokens

---

## 📞 Support

For issues, check:

- `DEMO_CREDENTIALS.md` - Detailed credentials
- Backend logs: `mvn spring-boot:run` output
- Database logs: PostgreSQL server logs
- Application logs: `elderly-care-backend/target/`

For more help, see the main README.md or GitHub documentation.
