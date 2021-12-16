import { useContext } from "react";
import { GlobalStateContext } from "../../store";
import { clearJwtInLocalStorage } from "../jwtModule";

function useSignOut(): { signOut: () => void } {
  const { state, dispatch } = useContext(GlobalStateContext);

  function signOut() {
    clearJwtInLocalStorage();
    dispatch({
      type: "SET EXISTING USER INIT DATA",
      payload: {
        globalMessages: [],
        user: null,
        hero: null,
        latestSavedActivities: [],
        latestSavedActivityDate: null,
        latestBattle: null,
        isSignedIn: false,
        allGameItems: [],
        awardedItemMessage: null,
      },
    });
    dispatch({ type: "SET JWT", payload: { jwt: null } });
  }

  return { signOut };
}

export default useSignOut;
