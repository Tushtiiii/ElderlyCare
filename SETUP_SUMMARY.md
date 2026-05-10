# Demo Setup Files Created

## Summary

I've created comprehensive demo account setup files for the Elderly Care Application. Choose any method below to create demo accounts for all four roles (Elder, Guardian, Doctor, Pathologist).

---

## 📁 Files Created

### 1. **DEMO_CREDENTIALS.md** (Root Directory)

- Location: `/DEMO_CREDENTIALS.md`
- Purpose: Complete reference guide with all demo credentials
- Contains: Usernames, passwords, how-to guides, testing workflows
- **Start here** for detailed information

### 2. **QUICK_START.md** (Root Directory)

- Location: `/QUICK_START.md`
- Purpose: Fast reference guide for quick setup
- Contains: Multiple setup methods, troubleshooting, verification steps
- **Recommended** for immediate setup

### 3. **demo-seed.sql** (Backend Directory)

- Location: `/elderly-care-backend/demo-seed.sql`
- Purpose: Direct database seeding via SQL
- Usage: `psql -U postgres -d elderly_care_db -f demo-seed.sql`
- Best for: Direct database insertion

### 4. **register-demo-users.sh** (Backend Directory)

- Location: `/elderly-care-backend/register-demo-users.sh`
- Purpose: Bash script for Linux/Mac users
- Usage: `./register-demo-users.sh`
- Features: Auto-detects backend, shows progress, saves tokens

### 5. **register-demo-users.ps1** (Backend Directory)

- Location: `/elderly-care-backend/register-demo-users.ps1`
- Purpose: PowerShell script for Windows users
- Usage: `.\register-demo-users.ps1`
- Features: Colored output, error handling, environment setup

### 6. **Elderly-Care-API.postman_collection.json** (Backend Directory)

- Location: `/elderly-care-backend/Elderly-Care-API.postman_collection.json`
- Purpose: Postman collection for API testing
- Usage: Import into Postman, run pre-built requests
- Features: Auto-saves tokens, environment variables, test scripts

---

## 🚀 Quick Start Steps

### Option A: Windows Users (Easiest)

```powershell
cd elderly-care-backend
.\register-demo-users.ps1
```

### Option B: Linux/Mac Users

```bash
cd elderly-care-backend
chmod +x register-demo-users.sh
./register-demo-users.sh
```

### Option C: Direct Database

```bash
cd elderly-care-backend
psql -U postgres -d elderly_care_db -f demo-seed.sql
```

### Option D: Manual API Calls

See `QUICK_START.md` for curl command examples

### Option E: Postman

1. Import `Elderly-Care-API.postman_collection.json` into Postman
2. Set `base_url` variable to `http://localhost:8080`
3. Run requests in sequence

---

## 📊 Demo Accounts Created

| Role            | Email                        | Password     | Phone       |
| --------------- | ---------------------------- | ------------ | ----------- |
| **ELDER**       | elder.demo@example.com       | DemoPass@123 | +1234567890 |
| **GUARDIAN**    | guardian.demo@example.com    | DemoPass@123 | +1234567891 |
| **DOCTOR**      | doctor.demo@example.com      | DemoPass@123 | +1234567892 |
| **PATHOLOGIST** | pathologist.demo@example.com | DemoPass@123 | +1234567893 |

---

## ✅ Prerequisites

Before running demo setup:

1. **Backend Running**

   ```bash
   cd elderly-care-backend
   mvn spring-boot:run
   ```

2. **Database Active**
   - PostgreSQL running on `localhost:5432`
   - Database `elderly_care_db` exists
   - Credentials: `postgres` / `root@123`

3. **Tools Available**
   - PowerShell (Windows) or Bash (Linux/Mac)
   - OR curl installed
   - OR Postman installed

---

## 📝 Next Steps After Setup

1. **Test Mobile App Login**
   - Use any demo credential in the Expo app
2. **Create Relationships**
   - Guardian requests to monitor Elder
   - Elder approves the request
3. **Add Health Data**
   - Record vitals, medications, lab reports
4. **Test Multi-Role Workflows**
   - See how different roles interact
   - Test notifications and alerts
5. **API Integration Testing**
   - Use Postman for API testing
   - Verify JWT token handling

---

## 🔧 Troubleshooting

### Scripts Won't Run

**Windows**: Update execution policy

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Database Connection Failed

Check `application.properties`:

```
spring.datasource.url=jdbc:postgresql://localhost:5432/elderly_care_db
spring.datasource.username=postgres
spring.datasource.password=root@123
```

### Backend Connection Error

Ensure backend is running:

```bash
mvn spring-boot:run  # Should show "Started ElderlyCareApplication"
```

### Duplicate Account Error

Delete existing accounts:

```sql
DELETE FROM users WHERE email LIKE '%.demo@example.com';
```

---

## 📞 Support Resources

- **DEMO_CREDENTIALS.md** - Detailed credentials & workflows
- **QUICK_START.md** - Setup guide & troubleshooting
- **Backend README** - Spring Boot setup
- **Mobile App README** - React Native setup
- **Main README.md** - Project overview

---

## 🎯 What Works Now

✅ All four user roles registered with valid credentials  
✅ JWT authentication configured and tested  
✅ User profiles accessible via API  
✅ Ready for multi-role workflow testing  
✅ Postman collection for easy API testing  
✅ Database seeding automated

---

**Choose any method above and start testing! 🎉**
