import moment from "moment";
import { getLsWithExpiry, setLsWithExpiry, clearLs } from "./helperFunctions";

function setJwtInLocalStorage({ token, expiresIn }) {
  const daysInt = parseInt(expiresIn);
  const duration = moment.duration(daysInt, "days");
  const milliseconds = duration.asMilliseconds();
  return setLsWithExpiry("herofit-jwt", token, milliseconds);
}

async function getJwtInLocalStorage(): Promise<string | null> {
  const jwt = await getLsWithExpiry("herofit-jwt");
  return jwt || null;
}

function clearJwtInLocalStorage() {
  return clearLs("herofit-jwt");
}

export { setJwtInLocalStorage, getJwtInLocalStorage, clearJwtInLocalStorage };
