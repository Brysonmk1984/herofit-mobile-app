import _axios from 'axios';
import axiosRetry from 'axios-retry';
import { axiosOptions, axiosDeleteConfig } from './axiosDefaults';
import handleHttpError from './handleHttpError';
import Constants from 'expo-constants';
const endpoint : string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, {retries: 3});

const fetchAvatarInventory = async function (body) {
  return axios.post(`${endpoint}inventory/fetch-avatar-inventory`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    }).catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const equipItem = async function (body) {
  return axios.post(`${endpoint}inventory/equip-item`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    }).catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const equipUnequipItem = async function (body) {
  return axios.post(`${endpoint}inventory/equip-unequip-item`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    }).catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const unequipItem = async function (body) {
  return axios.post(`${endpoint}inventory/unequip-item`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    }).catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const fetchAllGameItems = async function(){
  return axios.get(`${endpoint}inventory/get-default-items`, await axiosOptions())
  .then(({ data }) =>{
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
}

const fetchAllItemsOfTypeForSale = async function(body){
  return axios.post(`${endpoint}inventory/fetch-items-of-type-for-sale`, body, await axiosOptions())
  .then(({ data }) =>{
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
}

const insertItemByAvatarId = async function(body){
  return axios.post(`${endpoint}inventory/insert-item-by-avatar-id`, body, await axiosOptions())
  .then(({ data }) =>{
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
}

const insertItemForAllAvatars = async function(body){
  return axios.post(`${endpoint}inventory/insert-item-for-all-avatars`, body, await axiosOptions())
  .then(({ data }) =>{
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
}

const buyItemByAvatarId = async function(body){
  return axios.post(`${endpoint}inventory/buy-item-by-avatar-id`, body, await axiosOptions())
  .then(({ data }) =>{
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
}

const consumeItemRequest = async function(body){
  return axios.delete(`${endpoint}inventory/use-consumable-item`, await axiosDeleteConfig(body))
  .then(({ data }) =>{
    return data.data;
  }).catch(({ request, response }) => {
    throw handleHttpError(request, response);
  });
};

export { fetchAvatarInventory, equipItem, equipUnequipItem, unequipItem, fetchAllGameItems, fetchAllItemsOfTypeForSale, insertItemByAvatarId, insertItemForAllAvatars, buyItemByAvatarId, consumeItemRequest };
