import { AxiosRequestConfig, AxiosResponse } from 'axios';

function _checkEmptyObject(obj: object){
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}
interface httpErrorObj {
  error : {
    status: number | null
    message: string
    debug: string
  }
}

// Handles all errors resulting from or before network requests, formats returned error in consistent way for front end, which may also pass it to debugErrors
function handleHttpError(request: AxiosRequestConfig, response: AxiosResponse | undefined ) : httpErrorObj{

  if(response){
    const { status, data } = response;
    let { error, meta } = data;

    let errorArray;
    // If it's an object, it's likely a validation error, so map over it
    if(typeof error === 'object'){
      // This happens when the backend returns an error object without stringifying it. Shouldn't happen but sometimes I forget.
      if(_checkEmptyObject(error)){
        return [{
          status,
          message : `There was a server error, please try again later`,
          debug : [],
          meta : "Forgot to stringify error object returned from server"
        }]
      }

      if(error.length){
        // Map the error arrays to display readable strings
        errorArray = error.map((err) => {
          // If express validator error
          if(err.hasOwnProperty('msg') && err.hasOwnProperty('value') && err.hasOwnProperty('param') && err.hasOwnProperty('location')){
            return `${err.msg} - value ${err.value} of parameter ${err.param} in request ${err.location}`;
          // Any other custom error I write on the server
          }else{ return { error : err }; }
        }); 
      }else{
        errorArray = [error]
      }
    }else if(typeof error === 'string'){
      errorArray = [{
        msg : error,
        location : 'Backend'
      }];
    }else{
      errorArray = [error];
    }

    return {
      error : {
        status,
        message : error && error.message ? error.message : `There was a server error, please try again later`,
        debug : errorArray,
        meta
      }
    }
  // client never received a response, or request never left
  }else if(request) {

    return {
      error : {
        status : null,
        message : "Network Error, please try again later.",
        debug : "Request failed to go through."
      }
    }
  // No request was even made, error in code above
  }else{
    return {
      error : {
        status : null,
        message : "There was an error, please try again later.",
        debug : "Error in client code before the request was made!"
      }
    }
  }
}

export default handleHttpError;