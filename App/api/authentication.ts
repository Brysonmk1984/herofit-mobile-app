import _axios from "axios";
import axiosRetry from "axios-retry";
import { axiosOptions } from "./axiosDefaults";
import handleHttpError from "./handleHttpError";
import { setJwtInLocalStorage } from "../common/jwtModule";
import Constants from "expo-constants";
import { HeroChoice, User } from "../common/types";
const endpoint: string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, { retries: 3 });

const login = async function (body) {
  return axios
    .post(`${endpoint}auth/login`, body, await axiosOptions())
    .then(({ data }) => {
      if (data.error) {
        return data.error;
      }
      const { user, tokenObject } = data.data;

      setJwtInLocalStorage(tokenObject);
      return { user, tokenObject };
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

interface RegisterBody {
  email: string;
  firstName: string;
  username: string;
  password: string;
  emailMarketingOptIn: boolean;
  isMetric: boolean;
  foundOutBy: string;
  isMobileApp: true;
}

const register = async function (body: RegisterBody): Promise<{ user: User }> {
  return axios
    .post(`${endpoint}auth/register`, body, await axiosOptions())
    .then(async ({ data }) => {
      const { user, tokenObject } = data.data;
      await setJwtInLocalStorage(tokenObject);
      return { user };
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

interface ResetPasswordParams {
  email: string;
  token: string;
  password: string;
}
const resetPassword = async function (body: ResetPasswordParams) {
  return axios
    .post(`${endpoint}auth/reset-password`, body, await axiosOptions())
    .then(({ data }) => {
      return data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

// Meant for password reset, but also used for updating legacy accounts (pre may 2020), but this is handled through the web app
const sendPasswordResetEmailVerification = async function (body: { email: string; isMobileApp: true }) {
  return axios
    .post(`${endpoint}auth/reset-password-confirm-email`, body, await axiosOptions())
    .then(({ data }) => {
      return data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const getStravaClientCredentials = async function () {
  return axios
    .get(`${endpoint}auth/strava-client-credentials-app`, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const insertStravaCredentials = async function (body) {
  return axios
    .post(`${endpoint}auth/strava-credentials`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const fetchLatestPatchDetails = async function () {
  return axios
    .get(`${endpoint}auth/fetch-latest-patch-details`, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const updateSeenLatestPatch = async function (body) {
  return axios
    .post(`${endpoint}auth/update-seen-latest-patch`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

// Only meant for initial registration email confirm
const resendEmailConfirmation = async function (body) {
  return axios
    .post(`${endpoint}auth/resend-email-confirmation`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const getHeroList = async function (): Promise<HeroChoice[]> {
  return axios
    .get(`${endpoint}auth/hero-list`, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

// A user chooses 'Manual Mode' instead of strava
const createManualDataSrcId = async function (body: { email: string }): Promise<{ user: User }> {
  return axios
    .post(`${endpoint}auth/generate-datasrcid`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

export { login, register, getStravaClientCredentials, insertStravaCredentials, fetchLatestPatchDetails, updateSeenLatestPatch, resetPassword, sendPasswordResetEmailVerification, resendEmailConfirmation, getHeroList, createManualDataSrcId };
