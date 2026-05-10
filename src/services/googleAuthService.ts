import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import getGoogleOAuthConfig from '../config/googleOAuth';

// Get the scheme for deep linking (from app.json)
const scheme = Linking.createURL('/');
const redirectUrl = scheme.replace(/\/$/, '');

// Android-specific redirect URL
const androidRedirectUrl = 'com.anonymous.Elderlycare://oauth/callback';

interface GoogleAuthResponse {
  idToken: string;
  accessToken: string;
  userInfo: {
    email: string;
    name: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
  };
}

/**
 * Initiates Google OAuth flow using browser-based authentication.
 * Returns ID token and user info on success.
 * Optimized for Android with proper deep linking support.
 */
export const signInWithGoogle = async (): Promise<GoogleAuthResponse> => {
  try {
    const { clientId, clientSecret, isAndroid } = getGoogleOAuthConfig();

    // Use Android-specific redirect URL if on Android, otherwise use scheme-based URL
    const currentRedirectUrl = isAndroid ? androidRedirectUrl : redirectUrl;

    // Build Google auth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', currentRedirectUrl);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'openid email profile');
    authUrl.searchParams.append('prompt', 'consent');

    console.log(`[googleAuthService] Starting OAuth flow on ${isAndroid ? 'Android' : 'Web'}`);
    console.log(`[googleAuthService] Redirect URL: ${currentRedirectUrl}`);

    // Create a promise to handle the async redirect callback
    let code: string | null = null;
    let redirectUrlListener: any = null;

    const codePromise = new Promise<string>((resolve, reject) => {
      let timeout: NodeJS.Timeout;

      const handleRedirect = ({ url }: { url: string }) => {
        console.log(`[googleAuthService] Received redirect: ${url}`);
        if (url.includes('code=')) {
          code = new URL(url).searchParams.get('code');
          if (code) {
            console.log(`[googleAuthService] Authorization code received`);
            clearTimeout(timeout);
            if (redirectUrlListener) {
              redirectUrlListener.remove();
            }
            resolve(code);
          }
        } else if (url.includes('error=')) {
          const error = new URL(url).searchParams.get('error');
          clearTimeout(timeout);
          if (redirectUrlListener) {
            redirectUrlListener.remove();
          }
          reject(new Error(`Google OAuth error: ${error}`));
        }
      };

      // Set up listener for redirect BEFORE opening browser
      redirectUrlListener = Linking.addEventListener('url', handleRedirect);

      // Set timeout for the OAuth flow (5 minutes)
      timeout = setTimeout(() => {
        if (redirectUrlListener) {
          redirectUrlListener.remove();
        }
        reject(new Error('OAuth flow timeout - authorization code not received'));
      }, 5 * 60 * 1000);
    });

    // Open browser for OAuth
    console.log(`[googleAuthService] Opening OAuth URL...`);
    const result = await WebBrowser.openBrowserAsync(authUrl.toString());
    console.log(`[googleAuthService] Browser result:`, result);

    // If user cancelled, reject the promise
    if (result.type === 'cancel' || result.type === 'dismiss') {
      if (redirectUrlListener) {
        redirectUrlListener.remove();
      }
      throw new Error('Google Sign-in was cancelled or closed');
    }

    // Wait for the OAuth redirect callback to arrive
    try {
      code = await codePromise;
    } catch (error) {
      if (redirectUrlListener) {
        redirectUrlListener.remove();
      }
      throw error;
    }

    console.log(`[googleAuthService] Exchanging code for tokens...`);

    // Exchange code for tokens
    const tokenParams: Record<string, string> = {
      client_id: clientId,
      code,
      redirect_uri: currentRedirectUrl,
      grant_type: 'authorization_code',
    };

    // Only add client_secret for Web (Android doesn't use it)
    if (clientSecret) {
      tokenParams.client_secret = clientSecret;
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenParams).toString(),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error('[googleAuthService] Token exchange error:', tokenData);
      throw new Error(tokenData.error_description || 'Token exchange failed');
    }

    const idToken = tokenData.id_token;
    const accessToken = tokenData.access_token;

    // Decode ID token to get user info (basic JWT decoding)
    const userInfo = parseJwt(idToken);
    console.log(`[googleAuthService] Successfully authenticated user: ${userInfo.email}`);

    // Store tokens securely
    await SecureStore.setItemAsync('google_id_token', idToken);
    await SecureStore.setItemAsync('google_access_token', accessToken);

    return {
      idToken,
      accessToken,
      userInfo: {
        email: userInfo.email,
        name: userInfo.name,
        given_name: userInfo.given_name,
        family_name: userInfo.family_name,
        picture: userInfo.picture,
      },
    };
  } catch (error) {
    console.error('[googleAuthService] Sign-in error:', error);
    throw error;
  }
};

/**
 * Sign out from Google and clear stored tokens.
 */
export const signOutFromGoogle = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('google_id_token');
    await SecureStore.deleteItemAsync('google_access_token');
  } catch (error) {
    console.error('[googleAuthService] Sign-out error:', error);
  }
};

/**
 * Basic JWT parsing to extract claims (without verification).
 * For production, verify the token signature on your backend.
 */
const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[googleAuthService] JWT parsing error:', error);
    return {};
  }
};

/**
 * Get stored Google ID token (if available).
 */
export const getStoredIdToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('google_id_token');
  } catch (error) {
    console.error('[googleAuthService] Error retrieving stored token:', error);
    return null;
  }
};
