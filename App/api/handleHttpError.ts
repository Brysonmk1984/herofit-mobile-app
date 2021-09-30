import { AxiosRequestConfig, AxiosResponse } from "axios";

interface IhttpErrorObj {
  status: number | null;
  message: string;
  debug: string;
  meta?: string;
}

type errorType = string | Partial<IhttpErrorObj>;

// Determines what message the user will see from an error. Specific components have a chance to over-ride this message
function determineErrorMessage(error: errorType, status: number) {
  // Error normally is a string, with it's text meant for debugging purposes only. If instead it's an object,
  // and has a message property, then show the user that rather than a frontend message
  if (error?.message) {
    // Sometimes the backend will send an error message that the user should see
    return error.message;
  } else if (status >= 400 && status < 500) {
    // Client app error, such as sending the wrong body types to express server
    return `There was a client application error, please try again later`;
  } else {
    // Covers 500+ errors, or bugs where backend didn't send an error object in the response
    return `There was a server error, please try again later`;
  }
}

function _checkEmptyObject(obj: object) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

// Handles all errors resulting from or before network requests, formats returned error in consistent way for front end, which may also pass it to debugErrors
function handleHttpError(request: AxiosRequestConfig, response: AxiosResponse | undefined): IhttpErrorObj {
  if (response) {
    const { status, data } = response;
    let { error, meta } = data;
    //console.log('THE RESP=', response);

    let errorArray;
    // If it's an object, it's likely a validation error, so map over it
    if (typeof error === "object") {
      // This happens when the backend returns an error object without stringifying it. Shouldn't happen but sometimes I forget.
      if (_checkEmptyObject(error)) {
        return {
          status,
          message: `There was a server error, please try again later`,
          debug: "Error object has no properties",
          meta: "Forgot to stringify error object returned from server",
        };
      }

      // Currently, only express Validator will return an array of errors
      if (error.length) {
        // Map the error arrays to display readable strings
        errorArray = error.map(err => {
          // If express validator error
          if (err.hasOwnProperty("msg") && err.hasOwnProperty("value") && err.hasOwnProperty("param") && err.hasOwnProperty("location")) {
            return `${err.msg} - value ${err.value} of parameter ${err.param} in request ${err.location}`;
            // Any other custom error I write on the server
          } else {
            return { error: err };
          }
        });
        meta = errorArray[0].msg;
      } else {
        errorArray = [error];
        meta = errorArray[0].meta;
      }
    } else if (typeof error === "string") {
      errorArray = [
        {
          msg: error,
          location: "Backend",
        },
      ];
      meta = errorArray[0].msg;
    } else {
      if (error) {
        errorArray = [error];
        meta = errorArray[0]?.meta;
      } else {
        errorArray = [data.debug];
        meta = errorArray[0].meta;
      }
    }

    return {
      status,
      message: determineErrorMessage(error, status),
      debug: errorArray,
      meta,
    };

    // client never received a response, or request never left
  } else if (request) {
    return {
      status: null,
      message: "Network Error, please try again later.",
      debug: "Request failed to go through.",
    };
    // No request was even made, error in code above
  } else {
    return {
      status: null,
      message: "There was an error, please try again later.",
      debug: "Error in client code before the request was made!",
    };
  }
}

export default handleHttpError;
