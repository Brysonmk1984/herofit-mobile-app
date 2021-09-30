import axios from "axios";
import { Activity } from "../common/types";
import handleHttpError from "./handleHttpError";

interface StravaInitialAuthData {
  clientId: string;
  clientSecret: string;
  code: string;
}

const exchangeStravaAuthCode = function (authData: StravaInitialAuthData) {
  return axios
    .post(`https://www.strava.com/api/v3/oauth/token?client_id=${authData.clientId}&client_secret=${authData.clientSecret}&code=${authData.code}&grant_type=authorization_code`, { withCredentials: true })
    .then(({ data }) => {
      return data;
    })
    .catch(({ request, response }) => {
      response = { status: response.status, data: { message: response.data.message, debug: `Error connecting to Strava API - ${response.data.errors[0].code}: ${response.data.errors[0].field} - exchangeStravaAuthCode` } };
      throw handleHttpError(request, response);
    });
};

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

interface StravaRefreshAuthData {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

// Uses permanent refresh token to get an access token, needed for further requests
const getNewAccessToken = function (authData: StravaRefreshAuthData) {
  return axios
    .post(`https://www.strava.com/api/v3/oauth/token?client_id=${authData.clientId}&client_secret=${authData.clientSecret}&refresh_token=${authData.refreshToken}&grant_type=refresh_token`, { withCredentials: true })
    .then(({ data }) => {
      return data;
    })
    .catch(({ request, response }) => {
      response = { status: response.status, data: { message: response.data.message, debug: `Error connecting to Strava API - ${response.data.errors[0].code}: ${response.data.errors[0].field} - getNewAccessToken` } };
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

export { exchangeStravaAuthCode, getStravaActivityData, getNewAccessToken, getStravaUserId };
