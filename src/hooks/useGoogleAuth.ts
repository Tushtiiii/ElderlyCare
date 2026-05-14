import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function useGoogleAuth() {
  const scheme = Constants.expoConfig?.scheme ?? 'elderlycare';
  const useProxy = Platform.OS === 'web';
  const redirectUri = AuthSession.makeRedirectUri({
    scheme,
    path: 'oauth/callback',
    useProxy,
  });

  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB;
  const hasClientId = Platform.OS === 'web' ? !!webClientId : !!androidClientId;

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    webClientId,
    clientId: Platform.OS === 'web' ? webClientId : androidClientId,
    responseType: AuthSession.ResponseType.IdToken,
    scopes: ['openid', 'profile', 'email'],
    redirectUri,
    usePKCE: false,
  });

  return {
    promptAsync,
    response,
    isReady: !!request,
    hasClientId,
    useProxy,
  };
}

export function extractGoogleIdToken(
  response: AuthSession.AuthSessionResult | null,
): string | null {
  if (!response || response.type !== 'success') {
    return null;
  }

  const params = (response as AuthSession.AuthSessionResult & {
    params?: Record<string, string>;
  }).params;

  return params?.id_token ?? null;
}
