import _axios from "axios";
import axiosRetry from "axios-retry";
import { axiosOptions } from "./axiosDefaults";
import handleHttpError from "./handleHttpError";
import Constants from "expo-constants";
const endpoint: string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, { retries: 3 });

const getUser = async function (body?: { email?: string }): Promise<any> {
  return axios
    .post(`${endpoint}user/user-details`, body, await axiosOptions())
    .then(({ data }) => {
      const user = data.data.user;

      return { user };
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const getSavedActivities = async function (body) {
  return axios
    .post(`${endpoint}user/get-user-activities`, { ...body }, await axiosOptions())
    .then(({ data }) => {
      if (data.data.activities) {
        return { activities: data.data.activities, latestActivityDate: data.data.latestActivityDate };
      } else {
        return { activities: [], latestActivityDate: null };
      }
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const instantiateUserTotals = async function (body) {
  return axios
    .post(`${endpoint}user/instantiate-user-totals`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const updateUserTotals = async function (body) {
  return axios
    .post(`${endpoint}user/update-user-totals`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const getProfileInfoByHeroName = async function (body) {
  return axios
    .post(`${endpoint}user/get-profile-info-by-email`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const getMatchingUsers = async function (body) {
  return axios
    .post(`${endpoint}user/get-matching-users`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const getHeroNameByUsername = async function (body) {
  return axios
    .post(`${endpoint}user/get-hero-name-by-username`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

export { getUser, getSavedActivities, instantiateUserTotals, updateUserTotals, getProfileInfoByHeroName, getMatchingUsers, getHeroNameByUsername };
