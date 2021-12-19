import _axios from "axios";
import axiosRetry from "axios-retry";
import { axiosOptions, axiosDeleteConfig } from "./axiosDefaults";
import handleHttpError from "./handleHttpError";
import Constants from "expo-constants";
import { User } from "../common/types";
const endpoint: string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, { retries: 3 });

const updateAvatarName = async function (body) {
  return axios
    .post(`${endpoint}account/update-avatar-name`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const updateOwnerUsername = async function (body) {
  return axios
    .post(`${endpoint}account/update-owner-username`, body, await axiosOptions())
    .then(({ data }) => {
      return data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const deleteAccount = async function (body): Promise<{ message: string }> {
  return axios
    .delete(`${endpoint}account/${body.username}`, await axiosDeleteConfig(body))
    .then(({ data }): { message: string } => data)
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

// Delete Strava fields in user table for particular user
const disconnectDataSrc = async function (body): Promise<{ user: User }> {
  return axios
    .post(`${endpoint}auth/disconnect-data-src`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const updateMeasuringSystem = async function (body: { isMetric: boolean; email: string }): Promise<{ user: User; message: string }> {
  return axios
    .put(`${endpoint}account/toggle-metric-system`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

export { updateAvatarName, updateOwnerUsername, deleteAccount, disconnectDataSrc, updateMeasuringSystem };
