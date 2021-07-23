import _axios from 'axios';
import axiosRetry from 'axios-retry';
import { axiosOptions } from './axiosDefaults';
import handleHttpError from './handleHttpError';
import Constants from 'expo-constants';
const endpoint : string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, {retries: 3});

const insertAvatar = async function(body){
    return axios.post(`${endpoint}avatar/insert-avatar`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    }).catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const updateAvatarStats = async function(body){
  return axios.post(`${endpoint}avatar/update-avatar-stats`, body, await axiosOptions())
  .then(({ data }) => {
    return data.data || { data : null };
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
};

const upgradeSequence = async function(body){
  return axios.post(`${endpoint}avatar/upgrade-sequence`, body, await axiosOptions())
  .then(({ data }) => {
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
};

const getAvatar = async function(body){  
  return axios.post(`${endpoint}avatar/get-avatar`, body, await axiosOptions())
  .then(({ data }) => {
    const hero = data.data;
    return { hero };      
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
};

const checkAvatarName = async function(body){
  return axios.post(`${endpoint}avatar/check-avatar-name`, body, await axiosOptions())
  .then(({ data }) => {
    return data.data;      
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
};

const fetchAvatarsByPage = async function(body){
  return axios.post(`${endpoint}avatar/fetch-avatars-by-page`, body, await axiosOptions())
  .then(({ data }) => {
    return data.data;
  }).catch(({ request, response }) => {
    // Need to return here. If async is needed, need to wrap it in a new Promise
    // Client received an error response (5xx, 4xx, or something from bad code before request)
    throw handleHttpError(request, response);
  });
};

const fetchAvatarsByPageAndRankingType = async function(body){
  return axios.post(`${endpoint}avatar/fetch-avatars-by-page-and-ranking-type`, body, await axiosOptions())
  .then(({ data }) => {
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
};

const fetchAvatarsByPageAndRankingTypeBattle = async function(body){
  return axios.post(`${endpoint}avatar/fetch-avatars-by-page-and-ranking-type-battle`, body, await axiosOptions())
  .then(({ data }) => {
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
};


export { insertAvatar, updateAvatarStats, upgradeSequence, getAvatar, checkAvatarName, fetchAvatarsByPage, fetchAvatarsByPageAndRankingType, fetchAvatarsByPageAndRankingTypeBattle };