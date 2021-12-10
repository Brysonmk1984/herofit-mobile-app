import { useContext } from "react";
import { GlobalStateContext } from "../../store";
import debugErrors from "../debugErrors";
import fetchInitialData from "../fetchInitialData";
import useJwt from "./useJwt";

function useAppDataFetch(): { getAllAppData: (passedJwt?: any) => Promise<void>; jwt: string | null } {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [jwt] = useJwt();

  // local JWT check happened, JWT is still present. Use it to fetch user data,
  // Then after data returns, hide loading indicator / allow the app homepage to be presented
  async function getAllAppData() {
    if (!jwt) {
      // local JWT check happened, it's not there so stop loading which will show signin page
      dispatch({ type: "TOGGLE LOADING", payload: { isLoading: false } });
      return;
    }

    try {
      if (state.isSignedIn) {
        dispatch({ type: "TOGGLE IN APP LOADING", payload: { isLoadingInApp: true } });
      }

      await fetchInitialData(jwt, dispatch, state);
      dispatch({ type: "TOGGLE IN APP LOADING", payload: { isLoadingInApp: false } });
      setTimeout(() => {
        dispatch({ type: "TOGGLE LOADING", payload: { isLoading: false } });
      }, 1500);
    } catch (error) {
      console.log("JWT EXISTS, but ERROR FETCHING DATA");
      //addToast("error", "There was a problem fetching game data... Please try again later.");
      debugErrors(error);
      dispatch({ type: "RESET DEFAULTS" });
    }
  }

  return {
    getAllAppData,
    jwt,
  };
}

export default useAppDataFetch;
