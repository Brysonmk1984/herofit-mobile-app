import { useContext, useState } from "react";
import { GlobalStateContext } from "../../store";
import debugErrors from "../debugErrors";
import fetchInitialData from "../fetchInitialData";
import useGlobalToast from "./useGlobalToast";
import useJwt from "./useJwt";

function useAppDataFetch(): { getAllAppData: (manual?: boolean, passedJwt?: any) => Promise<void> } {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [jwt] = useJwt();

  const { addToast } = useGlobalToast();

  // local JWT check happened, JWT is still present. Use it to fetch user data,
  // Then after data returns, hide loading indicator / allow the app homepage to be presented
  async function getAllAppData(manual: boolean = false, passedJwt = null) {
    if (jwt === false) {
      // local JWT check happened, it's not there so stop loading which will show signin page
      dispatch({ type: "TOGGLE LOADING", payload: { isLoading: false } });
      return;
    }

    try {
      if (manual) {
        dispatch({ type: "TOGGLE IN APP LOADING", payload: { isLoadingInApp: true } });
      }

      await fetchInitialData(passedJwt ?? (jwt as string), dispatch, state);
    } catch (error) {
      console.log("JWT EXISTS, but ERROR FETCHING DATA");
      addToast("error", "There was a problem fetching game data... Please try again later.");
      debugErrors(error);
      dispatch({ type: "RESET DEFAULTS" });
    } finally {
      setTimeout(() => {
        dispatch({
          type: "TOGGLE LOADING",
          payload: { isLoading: false },
        });
        dispatch({
          type: "TOGGLE IN APP LOADING",
          payload: { isLoadingInApp: false },
        });
      }, 1000);
    }
  }

  return {
    getAllAppData,
  };
}

export default useAppDataFetch;
