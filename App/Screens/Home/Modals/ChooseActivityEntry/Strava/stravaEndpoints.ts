import Constants from "expo-constants";
export const STRAVA_REDIRECT_URI: string = Constants.manifest.extra.STRAVA_REDIRECT_URI;

const STRAVA_AUTHORIZATION_ENDPOINT: string = Constants.manifest.extra.STRAVA_AUTHORIZATION_ENDPOINT;
const STRAVA_TOKEN_ENDPOINT: string = Constants.manifest.extra.STRAVA_TOKEN_ENDPOINT;
const STRAVA_REVOCATION_ENDPOINT: string = Constants.manifest.extra.STRAVA_REVOCATION_ENDPOINT;

// STRAVA AUTH ENDPOINTS
export default {
  authorizationEndpoint: STRAVA_AUTHORIZATION_ENDPOINT,
  tokenEndpoint: STRAVA_TOKEN_ENDPOINT,
  revocationEndpoint: STRAVA_REVOCATION_ENDPOINT,
};
