import 'dotenv/config';

export default ({ config }) => {
  return {
    extra: {
      ENV: process.env.NODE_ENV,
      HF_ENDPOINT: process.env.HF_ENDPOINT,
      APP_ADMIN_PFA: process.env.APP_ADMIN_PFA,
      APP_VERSION: process.env.APP_VERSION
    },
    ...config,
  };
};

