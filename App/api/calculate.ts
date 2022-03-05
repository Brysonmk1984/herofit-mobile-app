import _axios from "axios";
import axiosRetry from "axios-retry";
import { axiosOptions, axiosDeleteConfig } from "./axiosDefaults";
import handleHttpError from "./handleHttpError";
import Constants from "expo-constants";
const endpoint: string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, { retries: 3 });

const fetchAstrologySeason = async function (body) {
  return axios
    .post(`${endpoint}calculate/fetch-astrology-season`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const fetchNextLevelXpByInput = async function (body) {
  return axios
    .post(`${endpoint}calculate/fetch-next-level-xp-by-input`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const checkLevelUpByInput = async function (body) {
  return axios
    .post(`${endpoint}calculate/check-level-up-by-input`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

export { fetchAstrologySeason, fetchNextLevelXpByInput, checkLevelUpByInput };
