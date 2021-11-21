import axios from "axios";
import handleHttpError from "./handleHttpError";
import Constants from "expo-constants";
import { axiosOptions } from "./axiosDefaults";
const endpoint: string = Constants.manifest.extra.HF_ENDPOINT;

const getStravaActivityData = function (stravaAccessToken: string): Promise<any[]> {
  return axios
    .get(`https://www.strava.com/api/v3/athlete/activities`, { headers: { Authorization: `Bearer ${stravaAccessToken}` } })
    .then(({ data }) => {
      return data;
    })
    .catch(({ request, response }) => {
      response = { status: response.status, data: { message: response.data.message, debug: `Error connecting to Strava API - ${response.data.errors[0].code}: ${response.data.errors[0].field} - getStravaActivityData` } };
      throw handleHttpError(request, response);
    });
};

// Uses permanent refresh token to get an access token, needed for further requests
const getStravaUserId = function (stravaAccessToken: string) {
  return axios
    .get(`https://www.strava.com/api/v3/athlete`, { headers: { Authorization: `Bearer ${stravaAccessToken}` } })
    .then(({ data }) => {
      return data;
    })
    .catch(({ request, response }) => {
      console.log("COME ON", response.data.errors);
      response = { status: response.status, data: { message: response.data.message, debug: `Error connecting to Strava API - ${response.data.errors[0].code}: ${response.data.errors[0].field} - getStravaUserId` } };

      console.log("HERE", response);
      throw handleHttpError(request, response);
    });
};

// Access and refresh token updating has been moved to backend:
const stravaFetchAndUpdateAccessToken = async function (body: { email: string }): Promise<{ user: User }> {
  return axios
    .post(`${endpoint}auth/strava-fetch-and-update-access-token`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

// First time strava authcode exchange for tokens has been moved to backend:
const stravaFirstTimeAuthCodeExchange = async function (body: { email: string; authCode: string }): Promise<{ user: User }> {
  return axios
    .post(`${endpoint}auth/strava-first-time-auth-code-exchange`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

export { getStravaActivityData, getStravaUserId, stravaFetchAndUpdateAccessToken, stravaFirstTimeAuthCodeExchange };
