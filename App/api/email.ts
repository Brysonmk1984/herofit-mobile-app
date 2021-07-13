import _axios from 'axios';
import axiosRetry from 'axios-retry';
import { axiosOptions } from './axiosDefaults';
import handleHttpError from './handleHttpError';
const endpoint = process.env.REACT_APP_HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, {retries: 3});


const emailFeedbackData = function(body : object, jwt : string){
    return axios.post(`${endpoint}email/feedback-data`, { ...body }, axiosOptions(jwt))
    .then(({ data }) =>{
        return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const emailSurveyData = function(body : object, jwt : string){
    return axios.post(`${endpoint}email/survey-data`, { ...body }, axiosOptions(jwt))
    .then(({ data }) =>{
        return data.data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const emailContactForm = function(body : object){
    return axios.post(`${endpoint}email/contact-form`, { ...body }, axiosOptions())
    .then(({ data }) =>{
        return data;
    }).catch(({ request, response }) => {
        throw handleHttpError(request, response);
    });
};

const emailAppError = function(body : { status : number }){
    const errorLocation = body.status === 400 || body.status === 500 ? 'Backend' : 'Frontend';
    return axios.post(`${endpoint}email/app-error`, { ...body, errorLocation }, axiosOptions())
    .then(({ data }) =>{
        console.log('APP ERROR Email Delivered', data);
    }).catch(({ request, response }) => {
        console.log('Error sending email - response', response);
        throw handleHttpError(request, response);
    });
};


export { emailFeedbackData, emailSurveyData, emailContactForm, emailAppError };