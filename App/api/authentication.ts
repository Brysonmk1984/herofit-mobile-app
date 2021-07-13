import _axios from 'axios';
import axiosRetry from 'axios-retry';
import { axiosOptions } from './axiosDefaults';
import handleHttpError from './handleHttpError';
import { setJwtInLocalStorage } from '../common/jwtModule';
import Constants from 'expo-constants';
const endpoint : string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, {retries: 3});


const login = function(body){
    return axios.post(`${endpoint}auth/login`, body, axiosOptions())
    .then(({ data }) => {
        if(data.error){
            return data.error;
        }
        const { user, tokenObject } = data.data;
        setJwtInLocalStorage(tokenObject);
        return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const register = function(body){
    return axios.post(`${endpoint}auth/register`, body, axiosOptions())
    .then(({ data }) => {
        setJwtInLocalStorage(data.data.tokenObject);
        return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const resetPassword = function(body){
    return axios.post(`${endpoint}auth/reset-password`, body, axiosOptions())
    .then(({ data }) => {
        return data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

// Only Meant for password reset
const sendPasswordResetEmailVerification = function(body){
    return axios.post(`${endpoint}auth/reset-password-confirm-email`, body, axiosOptions())
    .then(({ data }) => {
        return data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const getStravaClientCredentials = function(){
    return axios.get(`${endpoint}auth/strava-client-credentials`, axiosOptions())
    .then(({ data }) =>{
        return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const insertStravaCredentials = function(body){
    return axios.post(`${endpoint}auth/strava-credentials`, body, axiosOptions('cake'))
    .then(({ data }) => {
        return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    })
};


const fetchLatestPatchDetails = function(){

    return axios.get(`${endpoint}auth/fetch-latest-patch-details`, axiosOptions())
    .then(({ data }) =>{
      return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
}

const updateSeenLatestPatch = function(body){
    return axios.post(`${endpoint}auth/update-seen-latest-patch`, body, axiosOptions())
    .then(({ data }) =>{
      return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const sendVerificationCode = function(body){
    return axios.post(`${endpoint}auth/validated-email`, body, axiosOptions())
    .then(({ data }) =>{
      return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
}

// Only meant for initial registration email confirm
const resendEmailConfirmation = function(body){
    return axios.post(`${endpoint}auth/resend-email-confirmation`, body, axiosOptions())
    .then(({ data }) =>{
      return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
}

const getHeroList = function(){
  return axios.get(`${endpoint}auth/hero-list`, axiosOptions())
  .then(({ data }) =>{
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
};



export { login, register, getStravaClientCredentials, insertStravaCredentials, fetchLatestPatchDetails, updateSeenLatestPatch, resetPassword, sendPasswordResetEmailVerification, sendVerificationCode, resendEmailConfirmation, getHeroList }