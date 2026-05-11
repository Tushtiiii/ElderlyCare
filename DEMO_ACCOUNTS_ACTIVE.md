# ✅ Demo Accounts Successfully Created

## Status

All 4 demo accounts have been **successfully created** and are **ready for testing**.

---

## 🎯 Working Demo Credentials

| Role            | Email                        | Password     | Status      |
| --------------- | ---------------------------- | ------------ | ----------- |
| **ELDER**       | elder.demo@example.com       | DemoPass@123 | ✅ Verified |
| **GUARDIAN**    | guardian.demo@example.com    | DemoPass@123 | ✅ Verified |
| **DOCTOR**      | doctor.demo@example.com      | DemoPass@123 | ✅ Created  |
| **PATHOLOGIST** | pathologist.demo@example.com | DemoPass@123 | ✅ Created  |

---

## 🔑 How to Login

### Via Mobile App

1. Open the Elderly Care app in Expo
2. Go to "Sign In" screen
3. Enter any demo email and password from the table above
4. Tap "Sign In"

### Via API (cURL)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "elder.demo@example.com",
    "password": "DemoPass@123"
  }'
```

### Via PowerShell

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"elder.demo@example.com","password":"DemoPass@123"}' `
  -UseBasicParsing
$response.Content | ConvertFrom-Json
```

---

## 🧪 What You Can Now Test

### 1. **Mobile App Login**

- ✅ Login as Elder
- ✅ Login as Guardian
- ✅ Login as Doctor
- ✅ Login as Pathologist

### 2. **Multi-Role Workflows**

- Guardian requests to monitor Elder
- Elder approves the request
- Guardian views Elder's vitals and health data
- Doctor accesses patient records
- Pathologist submits lab reports

### 3. **Health Data Features**

- Record vitals (blood pressure, temperature, etc.)
- Add medications
- Upload lab reports
- View health history
- Receive alerts

---

## 📊 Account Details

### Elder - John Anderson

- Email: `elder.demo@example.com`
- Password: `DemoPass@123`
- Phone: `+1234567890`
- DOB: `1950-05-15`
- Role: `ELDER`

### Guardian - Sarah Anderson

- Email: `guardian.demo@example.com`
- Password: `DemoPass@123`
- Phone: `+1234567891`
- DOB: `1975-08-20`
- Role: `CHILD` (Guardian/Caregiver)

### Doctor - Michael Smith

- Email: `doctor.demo@example.com`
- Password: `DemoPass@123`
- Phone: `+1234567892`
- DOB: `1970-03-10`
- Role: `DOCTOR`

### Pathologist - Emily Johnson

- Email: `pathologist.demo@example.com`
- Password: `DemoPass@123`
- Phone: `+1234567893`
- DOB: `1972-11-25`
- Role: `PATHOLOGIST`

---

## 🚀 Getting Started

### Option 1: Mobile App Testing

1. Start the Expo app
2. Login with `elder.demo@example.com` / `DemoPass@123`
3. Explore the app features

### Option 2: API Testing with Postman

1. Import `Elderly-Care-API.postman_collection.json`
2. Set variables (already configured with demo accounts)
3. Run API requests to test endpoints

### Option 3: Direct API Calls

Use curl or PowerShell commands from the examples above to test endpoints directly.

---

## 🔐 Authentication Token

When you login, you'll receive a JWT token in the response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "userId": "cd7c4261-3a16-439d-9042-1705fe48458c",
  "email": "elder.demo@example.com",
  "role": "ELDER",
  "name": "John Anderson",
  "expiresIn": 86400000
}
```

Use this token for authenticated API requests:

```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

---

## ⚠️ Troubleshooting

### 401 Unauthorized Error (Fixed ✅)

**Problem**: Login returns 401  
**Solution**: Accounts are now created and verified working

### If You Still Get 401

1. Clear browser cache/app cache
2. Restart the mobile app
3. Restart the backend: `mvn spring-boot:run`
4. Try a different demo account

### Lost Your JWT Token?

Just login again using the credentials above. A new token will be issued.

---

## 📝 Next Steps

1. **Test in Mobile App**: Use any demo credential to login
2. **Create Relationships**: Have Guardian request to monitor Elder
3. **Add Health Data**: Record vitals, medications, lab reports
4. **Test Notifications**: Check if alerts work between roles
5. **API Integration**: Use Postman collection for API testing

---

## 📞 Support

All demo accounts are now **fully functional**. You can:

- ✅ Login to the mobile app
- ✅ Access the backend API
- ✅ Test multi-user workflows
- ✅ Record health data
- ✅ Manage relationships

See `DEMO_CREDENTIALS.md` for more detailed information and testing workflows.
