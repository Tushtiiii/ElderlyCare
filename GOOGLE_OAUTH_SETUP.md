# Google OAuth Setup Guide

This document explains how to set up Google OAuth for the Elderly Care application.

## Architecture

This app uses **Android OAuth Credentials with Deep Links** for the Expo app (works on both web and android):

- **Redirect URI**: `com.anonymous.Elderlycare://oauth/callback` (deep link)
- **Works on**: Web (Expo), Android, iOS
- **No Client Secret needed** (for mobile apps)

If you want a separate React web app, create an additional **Web OAuth Credential** with:

- **Redirect URI**: `https://yourdomain.com/api/auth/callback/google`

## Step 1: Create Android OAuth Credential

## Android Setup

### Get Android SHA-1 Certificate Fingerprint

For Expo development build, use the default Expo keystore SHA-1:

```
AA:C4:8D:F4:6D:02:B0:D1:3D:4D:3D:11:5D:99:F2:66:A4:E9:39:9A
```

If you're building a production APK, generate your own keystore and get the SHA-1:

```bash
keytool -list -v -keystore your-keystore.jks
```

### Add Android OAuth Credential in Google Cloud Console

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID** → **Android**
3. Enter:
   - **Package Name**: `com.anonymous.Elderlycare`
   - **SHA-1 Fingerprint**: (paste the SHA-1 from above)
4. Copy the generated **Client ID**

### Configure OAuth on Android

The app is already configured with:

- **Package**: `com.anonymous.Elderlycare`
- **Redirect URI**: `com.anonymous.Elderlycare://oauth/callback`
- **Intent Filters**: Configured in `app.json` for deep linking

**Important**: Android OAuth only requires the Client ID. There is **no client secret** for Android - mobile apps can't securely store secrets.

## Step 2: Configure Local Environment

1. Copy the environment template:

   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your separate credentials for Web and Android:

   ```
   EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB=your_web_client_id_here
   EXPO_PUBLIC_GOOGLE_CLIENT_SECRET_WEB=your_web_client_secret_here
   EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=your_android_client_id_here
   ```

### Environment Variables

| Variable                               | Platform | Required | Purpose                 |
| -------------------------------------- | -------- | -------- | ----------------------- |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB`     | Web      | ✅ Yes   | OAuth Web Client ID     |
| `EXPO_PUBLIC_GOOGLE_CLIENT_SECRET_WEB` | Web      | ✅ Yes   | OAuth Web Client Secret |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID` | Android  | ✅ Yes   | OAuth Android Client ID |

The app automatically detects the platform and uses the appropriate credentials. **Note**: Android doesn't use a secret because mobile apps cannot securely store secrets.

## Step 3: Restart the Development Server

```bash
npm start
# or
yarn start
```

Clear the cache if needed:

```bash
npm start -- --clear
# or
yarn start --clear
```

## Important Notes

⚠️ **Security**: Never commit `.env.local` to version control. It's already in `.gitignore`.

⚠️ **Production**: For production deployment, set these environment variables securely through your hosting platform (e.g., Vercel, AWS, Heroku, etc.).

## Testing Google Sign-In

1. Start the app with `npm start`
2. Go to Login or Register screen
3. Click "Sign in/up with Google"
4. Follow the OAuth flow in the browser
5. You should be redirected back to the app with your session

## Troubleshooting

### Issue: "Google OAuth Client ID is not configured"

- Make sure `.env.local` exists in the project root
- Verify `EXPO_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
- Restart the development server after updating `.env.local`

### Issue: "Invalid redirect URI"

- Check that your redirect URI in Google Cloud Console matches the one from the app
- Run the app and check the console logs for the exact redirect URI
- Update Google Cloud Console with the correct URI

### Issue: "Invalid Client ID or Secret"

- Double-check that you copied the credentials correctly
- Make sure there are no extra spaces or quotes in the `.env.local` file
