import _axios from "axios";
import axiosRetry from "axios-retry";
import { axiosOptions, axiosDeleteConfig } from "./axiosDefaults";
import handleHttpError from "./handleHttpError";
import Constants from "expo-constants";
import { AllFoes, Hero } from "../common/types";
import { Battle } from "../common/types-battle";
const endpoint: string = Constants.manifest.extra.HF_ENDPOINT;

let axios = _axios.create();
axiosRetry(axios, { retries: 3 });

interface SendHeroToBattleBody {
  email: string;
  avatar: Hero;
}

const sendHeroToBattle = async function (body: SendHeroToBattleBody) {
  return axios
    .post(`${endpoint}battle/insert-battle`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const fetchBattleReport = async function (body): Promise<{ latestBattle: Battle | null }> {
  return axios
    .post(`${endpoint}battle/fetch-battle-report`, body, await axiosOptions())
    .then(({ data }) => {
      const { result } = data.data;
      return { latestBattle: result ? result : null };
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const fetchBattleReportById = async function (body) {
  return axios
    .post(`${endpoint}battle/fetch-battle-report-by-id`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const updateBattleReportSeen = async function (body) {
  return axios
    .post(`${endpoint}battle/update-battle-report-seen`, body, await axiosOptions())
    .then(({ data }) => {
      return data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const getVillainList = async function (): Promise<{ villains: AllFoes[] }> {
  return axios
    .get(`${endpoint}battle/villain-list`, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const fetchBattlesWonOrDkoByAvatarID = async function (body: { avatarID: number }): Promise<{ battles: Battle[] }> {
  interface Data {
    data: {
      battles: Battle[];
    };
  }
  return axios
    .post(`${endpoint}battle/fetch-battles-won-or-dko`, body, await axiosOptions())
    .then(({ data }: { data: Data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const fetchUpcomingFoeAndRewards = async function (body) {
  return axios
    .post(`${endpoint}battle/fetch-upcoming-foe-and-rewards`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

const runSpecificBattle = async function (body) {
  return axios
    .post(`${endpoint}battle/run-specific-battle`, body, await axiosOptions())
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ request, response }) => {
      throw handleHttpError(request, response);
    });
};

export { sendHeroToBattle, fetchBattleReport, updateBattleReportSeen, getVillainList, fetchBattlesWonOrDkoByAvatarID, fetchUpcomingFoeAndRewards, fetchBattleReportById, runSpecificBattle };
