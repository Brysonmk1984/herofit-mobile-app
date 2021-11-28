import { emailAppError } from "../api/email";
import { User, AppDispatch } from "./types";
import Constants from "expo-constants";
const appVersion: string = Constants.manifest.extra.APP_VERSION;

interface IappError {
  status: number;
  message: string;
  debug: string;
  version: string;
  accountInfo?: object;
  meta?: string;
}

type appError = IappError | string;

// Decides how to report users to end users and the dev team
function debugErrors(error: appError, user?: User, dispatch?: AppDispatch): string {
  if (typeof error === "string") {
    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
      emailAppError({ status: 999, message: error, version: process.env.APP_VERSION, accountInfo: user });
      return error;
    } else {
      console.log("ERROR STRING ONLY - ", error);
      return error;
    }
  } else {
    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
      // 403 is usually related to leaving HeroFit open on a device. The default message will now tell them to refresh the page.
      if (error.status === 403 || error.status === 401) {
        console.log(error.status === 403, "403 error, usually from first startup?");
        console.log(error.status === 401, "401 error, expired or missing token");
      } else {
        console.error("NOT 403 or 401, emailing app error");
        emailAppError({ status: error.status, message: error.message, debug: error.debug, version: process.env.APP_VERSION, accountInfo: user, meta: error.meta });
      }
      return error.message;
    } else {
      if (error.status === 403) {
        console.log("403 error, usually from first startup?");
      } else if (error.status === 401) {
        console.log("401 error, expired or missing token");
      } else {
        console.error(`STATUS: ${error.status} \n`, `MESSAGE: ${error.message} \n`, `DEBUG:`, error.debug, `META: ${error.meta}`);
      }
      return error.message;
    }
  }
}

export function createAppError(message: string, debug: string, user: User): IappError {
  return {
    status: 808,
    message,
    debug,
    version: appVersion,
    accountInfo: user,
  };
}

export default debugErrors;
