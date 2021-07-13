import moment from 'moment';
import { getLsWithExpiry, setLsWithExpiry } from './helperFunctions';


function setJwtInLocalStorage({ token, expiresIn }){
  const daysInt = parseInt(expiresIn);
  const duration = moment.duration(daysInt, 'days');
  const milliseconds = duration.asMilliseconds();
  setLsWithExpiry('herofit-jwt', token, milliseconds);
};

function getJwtInLocalStorage(){
  return getLsWithExpiry('herofit-jwt');
}

export { setJwtInLocalStorage, getJwtInLocalStorage };