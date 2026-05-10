/**
 * Google OAuth Configuration
 * Reads from environment variables exported from .env.local
 * 
 * Android: Only needs Client ID (no secret for mobile apps)
 * Web: Needs both Client ID and Client Secret
 */

import { Platform } from 'react-native';

const getGoogleOAuthConfig = () => {
  const isAndroid = Platform.OS === 'android';

  // Use platform-specific credentials if available, otherwise fall back to generic ones
  const clientId = isAndroid
    ? process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
    : process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

  const clientSecret = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET_WEB || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    throw new Error(
      `Google OAuth Client ID is not configured for ${isAndroid ? 'Android' : 'Web'}. ` +
      `Please set EXPO_PUBLIC_GOOGLE_CLIENT_ID_${isAndroid ? 'ANDROID' : 'WEB'} or EXPO_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file.`,
    );
  }

  // Client Secret is only required for Web (not for Android)
  if (!isAndroid && (!clientSecret || clientSecret === 'YOUR_GOOGLE_CLIENT_SECRET_HERE')) {
    throw new Error(
      'Google OAuth Client Secret is not configured for Web. ' +
      'Please set EXPO_PUBLIC_GOOGLE_CLIENT_SECRET_WEB or EXPO_PUBLIC_GOOGLE_CLIENT_SECRET in your .env.local file.',
    );
  }

  return {
    clientId,
    clientSecret: isAndroid ? undefined : clientSecret,
    isAndroid,
  };
};

export default getGoogleOAuthConfig;
