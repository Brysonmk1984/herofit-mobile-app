import jwt_decode from "jwt-decode";
import { getSavedActivities, getUser } from "../api/user";
import { getAvatar } from "../api/avatar";
import { fetchAllGameItems } from "../api/inventory";
import { convertItemIdsToFullItems } from "./helperFunctions";
import { fetchBattleReport } from "../api/battle";
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
    const [p1, p2, p3, p4, p5] = await Promise.all([getUser(), getAvatar({ email, isMobileApp: true }), fetchAllGameItems(), fetchBattleReport({ owner: email }), getSavedActivities({ email, count: 10 })]);
    const user: User = p1.user;
    const hero: Hero = p2.hero;
    const awardedItemMessage: string = p2.awardedItemMessage;
    const allGameItems: Item[] = p3.items.map(item => ({ ...item, itemID: item.id }));
    const latestBattle = p4.latestBattle;
    const { activities: latestSavedActivities, latestActivityDate: latestSavedActivityDate } = p5;

    // Takes item instance IDs and assigns full items to the hero under 'equipped' property
    const equipped = convertItemIdsToFullItems(hero.equipped, allGameItems);
    hero.equipped = equipped;

    const userStatus = user.active ? "active" : "unconfirmed";

    dispatch({ type: "SET EXISTING USER INIT DATA", payload: { user, hero, latestBattle, isSignedIn: true, userStatus, latestSavedActivities, latestSavedActivityDate, allGameItems, awardedItemMessage } });
  } catch (error) {
    let message, alertType;

    if (error.status === 401) {
      // JWT has expired, just warn user so they can log in again
      console.log("JWTexpired - Should immediately kick user out to login screen without going to homescreen first");
    } else {
      // Error unrelated to JWT, display error message
      message = error.message;
      debugErrors(error);
    }
    dispatch({ type: "RESET DEFAULTS" });
    throw error;
  }
}

export default fetchInitialData;
