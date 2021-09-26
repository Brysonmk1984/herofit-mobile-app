import jwt_decode from "jwt-decode";
import { getUser } from "../api/user";
import { getAvatar } from "../api/avatar";
import { fetchAllGameItems } from "../api/inventory";
import { convertItemIdsToFullItems } from "./helperFunctions";
import { fetchBattleReport } from "../api/battle";
import { updateAlerts } from "./alerts";
import debugErrors from "./debugErrors";
import { User, Hero, Item, AppDispatch, InitialAppState } from "./types";

// FETCH ALL THE NEEDED DATA FOR INITIALIZING THE HOME SCREEN
// Either accepts the jwt token and gets email from it in the case of already-valid jwt, or accepts email as a parameter in the case of signing in
// user, hero, items, latestBattle
async function fetchInitialData(token: string, dispatch: AppDispatch, state: InitialAppState, email: string | null = null) {
  try {
    // Decode the JWT to get email, needed for fetching avatar
    if (token) {
      ({ email } = jwt_decode(token));
    }

    // Fetch the user, avatar, and all game items
    const [p1, p2, p3, p4] = await Promise.all([getUser(), getAvatar({ email }), fetchAllGameItems(), fetchBattleReport({ owner: email })]);
    const user: User = p1.user;
    const hero: Hero = p2.hero;
    const items: Item[] = p3.items;
    const latestBattle = p4.latestBattle;

    // Takes item instance IDs and assigns full items to the hero under 'equipped' property
    const equipped = convertItemIdsToFullItems(hero.equipped, items);
    hero.equipped = equipped;

    const userStatus = user.active ? "active" : "unconfirmed";

    dispatch({ type: "SET EXISTING USER INIT DATA", payload: { user, hero, items, latestBattle, isSignedIn: true, userStatus } });
  } catch (error) {
    let message, alertType;

    if (error.status === 401) {
      // JWT has expired, just warn user so they can log in again
      // ERROR MESSAGE IS KIND OF UNNECESSARY
      //message = error.meta;
      //alertType = "warning";
    } else {
      // Error unrelated to JWT, display error message
      message = error.message;
      alertType = "error";
      debugErrors(error);
      updateAlerts([{ type: alertType, message }], state, dispatch);
      dispatch({ type: "RESET DEFAULTS" });
    }

    // debugErrors(error);
    // updateAlerts([{ type: alertType, message }], state, dispatch);
    // dispatch({ type: "RESET DEFAULTS" });
  }
}

export default fetchInitialData;
