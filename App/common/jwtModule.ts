import moment from "moment";
import { getLsWithExpiry, setLsWithExpiry, clearLs } from "./helperFunctions";

function setJwtInLocalStorage({ token, expiresIn }) {
  const daysInt = parseInt(expiresIn);
  const duration = moment.duration(daysInt, "days");
  const milliseconds = duration.asMilliseconds();
  return setLsWithExpiry("herofit-jwt", token, milliseconds);
}

function getJwtInLocalStorage(): Promise<string | false> {
  return getLsWithExpiry("herofit-jwt");
}

function clearJwtInLocalStorage() {
  return clearLs("herofit-jwt");
}

export { setJwtInLocalStorage, getJwtInLocalStorage, clearJwtInLocalStorage };
