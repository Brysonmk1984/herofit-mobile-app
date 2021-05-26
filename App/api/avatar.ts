import _axios from 'axios';
import axiosRetry from 'axios-retry';
import { axiosOptions } from './axiosDefaults';
import handleHttpError from './handleHttpError';
import Constants from 'expo-constants';
const endpoint : string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, {retries: 3});

const insertAvatar = function(body, jwt){
  return axios.post(`${endpoint}avatar/insert-avatar`, { ...body }, axiosOptions(jwt))
  .then(({ data }) => {
    return data.data;
  }).catch(({ request, response }) => {
    return handleHttpError(request, response);
  });
};

const updateAvatar = function(body, jwt){
  return axios.post(`${endpoint}avatar/update-avatar`, { ...body }, axiosOptions(jwt))
  .then(({ data }) => {
    return data.data || { data : null };
  }).catch(({ request, response }) => {
    return handleHttpError(request, response);
  });
};

const buffAndUpdateAvatar = function(body, jwt){
  return axios.post(`${endpoint}avatar/buff-and-update-avatar`, { ...body }, axiosOptions(jwt))
  .then(({ data }) => {
    return data.data;
  }).catch(({ request, response }) => {
    return handleHttpError(request, response);
  });
};

const getAvatar = function(body, jwt){  
  return axios.post(`${endpoint}avatar/get-avatar`, { ...body }, axiosOptions(jwt))
  .then(({ data }) => {
    const avatar = data.data;
    return { avatar };      
  }).catch(({ request, response }) => {
    return handleHttpError(request, response);
  });
};

const checkAvatarName = function(body){
  return axios.post(`${endpoint}avatar/check-avatar-name`, { ...body }, axiosOptions())
  .then(({ data }) => {
    return data.data;      
  }).catch(({ request, response }) => {
    return handleHttpError(request, response);
  });
};

const fetchAvatarsByPage = function(body){
  return axios.post(`${endpoint}avatar/fetch-avatars-by-page`, { ...body }, axiosOptions())
  .then(({ data }) => {
    return data.data;
  }).catch(({ request, response }) => {
    // Need to return here. If async is needed, need to wrap it in a new Promise
    // Client received an error response (5xx, 4xx, or something from bad code before request)
    return handleHttpError(request, response);
  });
};

const fetchAvatarsByPageAndRankingType = function(body){
  return axios.post(`${endpoint}avatar/fetch-avatars-by-page-and-ranking-type`,{ ...body }, axiosOptions())
  .then(({ data }) => {
    return data.data;
  }).catch(({ request, response }) => {
    return handleHttpError(request, response);
  });
};

const fetchAvatarsByPageAndRankingTypeBattle = function(body){
  return axios.post(`${endpoint}avatar/fetch-avatars-by-page-and-ranking-type-battle`,{ ...body }, axiosOptions())
  .then(({ data }) => {
    return data.data;
  }).catch(({ request, response }) => {
    return handleHttpError(request, response);
  });
};


export { insertAvatar, updateAvatar, buffAndUpdateAvatar, getAvatar, checkAvatarName, fetchAvatarsByPage, fetchAvatarsByPageAndRankingType, fetchAvatarsByPageAndRankingTypeBattle }