import _axios from 'axios';
import axiosRetry from 'axios-retry';
import { axiosOptions } from './axiosDefaults';
import handleHttpError from './handleHttpError';
import Constants from 'expo-constants';
const endpoint : string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, {retries: 3});

const authenticate = function(body, jwt){
    return axios.get(`${endpoint}authenticate/signup-or-signin`, axiosOptions(jwt))
    .then(({ data }) => {
        return data.data;
    }).catch(({ request, response }) => {
        return handleHttpError(request, response);
    });
};

const getStravaClientCredentials = function(body, jwt){
    return axios.get(`${endpoint}authenticate/strava-client-credentials`, axiosOptions(jwt))
    .then(({ data }) =>{
        return data.data;
    }).catch(({ request, response }) => {
        return handleHttpError(request, response);
    });
};

const insertStravaCredentials = function(body, jwt){
    return axios.post(`${endpoint}authenticate/strava-credentials`, { ...body }, axiosOptions(jwt))
    .then(({ data }) => {
        return data.data;
    }).catch(({ request, response }) => {
        return handleHttpError(request, response);
    })
};


const fetchLatestPatchDetails = function(body, jwt){

    return axios.get(`${endpoint}authenticate/fetch-latest-patch-details`, axiosOptions(jwt))
    .then(({ data }) =>{
      return data.data;
    }).catch(({ request, response }) => {
        return handleHttpError(request, response);
    });
}

const updateSeenLatestPatch = function(body, jwt){
    return axios.post(`${endpoint}authenticate/update-seen-latest-patch`, { ...body }, axiosOptions(jwt))
    .then(({ data }) =>{
      return data.data;
    }).catch(({ request, response }) => {
        return handleHttpError(request, response);
    });
};


const getHeroList = function(){
  return axios.get(`${endpoint}authenticate/hero-list`, axiosOptions())
  .then(({ data }) =>{
    return data.data;
  }).catch(({ request, response }) => {
    return handleHttpError(request, response);
  });


};



export { authenticate, getStravaClientCredentials, insertStravaCredentials, fetchLatestPatchDetails, updateSeenLatestPatch, getHeroList }