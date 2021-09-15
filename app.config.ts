import "dotenv/config";

export default ({ config }) => {
  return {
    extra: {
      ENV: process.env.NODE_ENV,
      HF_ENDPOINT: process.env.HF_ENDPOINT,
      APP_ADMIN_PFA: process.env.APP_ADMIN_PFA,
      APP_VERSION: process.env.APP_VERSION,
      STRAVA_REDIRECT_URI: process.env.APP_STRAVA_REDIRECT_URI,
      STRAVA_AUTHORIZATION_ENDPOINT: process.env.APP_STRAVA_AUTHORIZATION_ENDPOINT,
      STRAVA_TOKEN_ENDPOINT: process.env.APP_STRAVA_TOKEN_ENDPOINT,
      STRAVA_REVOCATION_ENDPOINT: process.env.APP_STRAVA_REVOCATION_ENDPOINT,
    },
    ...config,
  };
};
