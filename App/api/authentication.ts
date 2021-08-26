import _axios from 'axios';
import axiosRetry from 'axios-retry';
import { axiosOptions } from './axiosDefaults';
import handleHttpError from './handleHttpError';
import { setJwtInLocalStorage } from '../common/jwtModule';
import Constants from 'expo-constants';
import { HeroChoice, User } from '../common/types';
const endpoint : string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, {retries: 3});


const login = async function(body){
    return axios.post(`${endpoint}auth/login`, body, await axiosOptions())
    .then(({ data }) => {
        if(data.error){
            return data.error;
        }
        const { user, tokenObject } = data.data;

        setJwtInLocalStorage(tokenObject);
        return { user, tokenObject };
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

interface RegisterBody{ email : string, firstName : string, username : string, password : string, emailMarketingOptIn : boolean }

const register = async function(body : RegisterBody) : Promise<{user:User}>{
    return axios.post(`${endpoint}auth/register`, body, await axiosOptions())
    .then(async ({ data }) => {
        const { user, tokenObject } = data.data;
        console.log('USER', user);
        console.log('TOKEN OBJ', tokenObject);
        await setJwtInLocalStorage(tokenObject);
        console.log('SET JWT');
        return { user };
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const resetPassword = async function(body){
    return axios.post(`${endpoint}auth/reset-password`, body, await  axiosOptions())
    .then(({ data }) => {
        return data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

// Only Meant for password reset
const sendPasswordResetEmailVerification = async function(body){
    return axios.post(`${endpoint}auth/reset-password-confirm-email`, body, await  axiosOptions())
    .then(({ data }) => {
        return data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const getStravaClientCredentials = async function(){
    return axios.get(`${endpoint}auth/strava-client-credentials`, await  axiosOptions())
    .then(({ data }) =>{
        return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const insertStravaCredentials = async function(body){
    return axios.post(`${endpoint}auth/strava-credentials`, body, await  axiosOptions())
    .then(({ data }) => {
        return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    })
};


const fetchLatestPatchDetails = async function(){

    return axios.get(`${endpoint}auth/fetch-latest-patch-details`, await  axiosOptions())
    .then(({ data }) =>{
      return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
}

const updateSeenLatestPatch = async function(body){
    return axios.post(`${endpoint}auth/update-seen-latest-patch`, body, await  axiosOptions())
    .then(({ data }) =>{
      return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const sendVerificationCode = async function(body){
    return axios.post(`${endpoint}auth/validated-email`, body, await  axiosOptions())
    .then(({ data }) =>{
      return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
}

// Only meant for initial registration email confirm
const resendEmailConfirmation = async function(body){
    return axios.post(`${endpoint}auth/resend-email-confirmation`, body, await  axiosOptions())
    .then(({ data }) =>{
      return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
}

const getHeroList = async function() : Promise<HeroChoice[]>{
  return axios.get(`${endpoint}auth/hero-list`, await  axiosOptions())
  .then(({ data }) =>{
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
};



export { login, register, getStravaClientCredentials, insertStravaCredentials, fetchLatestPatchDetails, updateSeenLatestPatch, resetPassword, sendPasswordResetEmailVerification, sendVerificationCode, resendEmailConfirmation, getHeroList }