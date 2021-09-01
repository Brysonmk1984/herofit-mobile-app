import _axios from "axios";
import axiosRetry from "axios-retry";
import { axiosOptions } from "./axiosDefaults";
import handleHttpError from "./handleHttpError";
import Constants from "expo-constants";
import { User } from "../common/types";
const endpoint: string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, { retries: 3 });

const emailFeedbackData = async function (body) {
  return axios
    .post(`${endpoint}email/feedback-data`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const emailSurveyData = async function (body) {
  return axios
    .post(`${endpoint}email/survey-data`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

interface MessageAccountInfo {
  email: string;
  firstName: string;
  username: string;
}

const emailContactForm = async function (body: { email: string; feedbackType: string; message: string; accountInfo: MessageAccountInfo }): Promise<any> {
  return axios
    .post(`${endpoint}email/contact-form`, body, await axiosOptions())
    .then(({ data }) => {
      return data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const emailAppError = async function (body) {
  body.errorLocation = body.status === 400 || body.status === 500 ? "Backend" : "Frontend";
  return axios
    .post(`${endpoint}email/app-error`, body, await axiosOptions())
    .then(({ data }) => {
      console.log("APP ERROR Email Delivered", data);
    })
    .catch(({ request, response }) => {
      console.log("Error sending email - response", response);
      throw handleHttpError(request, response);
    });
};

export { emailFeedbackData, emailSurveyData, emailContactForm, emailAppError };
