import axios from "axios";
import handleHttpError from "./handleHttpError";

const exchangeStravaAuthCode = function (authData, resolve, reject) {
  //console.log('LOOK = ', `https://www.strava.com/api/v3/oauth/token?client_id=${authData.clientId}&client_secret=${authData.clientSecret}&code=${authData.code}&grant_type=authorization_code`);
  return axios
    .post(`https://www.strava.com/api/v3/oauth/token?client_id=${authData.clientId}&client_secret=${authData.clientSecret}&code=${authData.code}&grant_type=authorization_code`, { withCredentials: true })
    .then(data => {
      resolve(data.data);
    })
    .catch(error => {
      let e = error.response;
      reject({ status: e.status, message: e.data.message, debug: JSON.stringify(e.data.errors[0]) });
    });
};

const getStravaActivityData = function (stravaAccessToken, resolve, reject) {
  return axios
    .get(`https://www.strava.com/api/v3/athlete/activities`, { headers: { Authorization: `Bearer ${stravaAccessToken}` } })
    .then(data => {
      resolve(data.data);
    })
    .catch(error => {
      let e = error.response;
      reject({ status: e.status, message: e.data.message, debug: JSON.stringify(e.data.errors[0]) });
    });
};

// Uses permanent refresh token to get an access token, needed for further requests
const getNewAccessToken = function (authData, resolve, reject) {
  return axios
    .post(`https://www.strava.com/api/v3/oauth/token?client_id=${authData.clientId}&client_secret=${authData.clientSecret}&refresh_token=${authData.refreshToken}&grant_type=refresh_token`, { withCredentials: true })
    .then(data => {
      resolve(data.data);
    })
    .catch(error => {
      let e = error.response;
      reject({ status: e.status, message: e.data.message, debug: JSON.stringify(e.data.errors[0]) });
    });
};

// Uses permanent refresh token to get an access token, needed for further requests
const getStravaUserId = function (stravaAccessToken) {
  return axios
    .get(`https://www.strava.com/api/v3/athlete`, { headers: { Authorization: `Bearer ${stravaAccessToken}` } })
    .then(({ data }) => {
      return data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

export { exchangeStravaAuthCode, getStravaActivityData, getNewAccessToken, getStravaUserId };
