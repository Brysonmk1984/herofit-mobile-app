import { useState, useEffect, useRef, useContext } from "react";
import { AppState } from "react-native";
import { GlobalStateContext } from "../../store";

function useForegroundListener() {
  const { state, dispatch } = useContext(GlobalStateContext);
  const appState = useRef(AppState.currentState);
  const [refreshAppData, setRefreshAppData] = useState(false);

  // Handles detecting when the app comes back to the foreground
  const _handleAppStateChange = nextAppState => {
    if (nextAppState === "active") {
      // get new info
      setRefreshAppData(true);
    } else if (nextAppState === "inactive" || nextAppState === "background") {
      // reset rereshAppData flag so that when it's brought to the foreground next time, app will refresh
      setRefreshAppData(false);
    }
    appState.current = nextAppState;
  };

  // Only add Foreground listener is active user
  useEffect(() => {
    if (state.userStatus !== "unconfirmed") {
      AppState.addEventListener("change", _handleAppStateChange);
      return () => AppState.removeEventListener("change", _handleAppStateChange);
    }
  }, []);

  return {
    refreshAppData,
  };
}

export default useForegroundListener;
