import React, { createContext, useReducer, Context, FC, ReactElement } from "react";
import { InitialAppState, AppAction } from "./common/types";

const initialState: InitialAppState = { isLoading: true, isSignedIn: false, userStatus: "new", user: null, hero: null, latestSavedActivities: [], latestSavedActivityDate: null, alerts: [], jwt: null, modalQueue: [] };

type AppState = typeof initialState;

const GlobalStateContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> }>({ state: initialState, dispatch: () => {} });

function appStateReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE LOADING": {
      const { isLoading } = action.payload;
      if (typeof isLoading === "undefined") {
        return Object.assign({}, state, { isLoading: !state.isLoading });
      }
      return Object.assign({}, state, { isLoading });
    }
    case "SET EXISTING USER INIT DATA": {
      const existingUserInitData = action.payload;
      return { ...state, ...existingUserInitData };
    }
    case "SET ISSIGNEDIN": {
      const { isSignedIn } = action.payload;
      return { ...state, isSignedIn };
    }
    // Used to determine if User is "active" | "new" | "unconfirmed"
    case "SET USER STATUS": {
      const { userStatus } = action.payload;
      return { ...state, userStatus };
    }
    case "SET HERO": {
      const { hero } = action.payload;
      return { ...state, hero };
    }
    case "SET USER": {
      const { user, isSignedIn } = action.payload;
      return { ...state, user, isSignedIn };
    }
    case "SET ALERTS": {
      const { alerts } = action.payload;
      return { ...state, alerts: [...alerts] };
    }
    case "RESET DEFAULTS": {
      return { ...state, isLoading: false, hero: null, user: null };
    }
    case "REMOVE ALERTS": {
      const { indiciesForRemoval } = action.payload;
      return {
        ...state,
        alerts: state.alerts.filter(alert => {
          return !indiciesForRemoval.includes(alert.index);
        }),
      };
    }
    case "ADD MODAL": {
      const { id } = action.payload;
      // Shouldn't happen
      if (state.modalQueue.includes(id)) {
        return state;
      }
      const modalQueue = [...state.modalQueue, id];
      return {
        ...state,
        modalQueue,
      };
    }
    case "REMOVE MODAL": {
      const { id } = action.payload;
      const modalQueue = [...state.modalQueue];
      // Remove matching ID
      modalQueue.splice(modalQueue.indexOf(id), 1);
      return {
        ...state,
        modalQueue,
      };
    }
    default:
      throw new Error("In Store default, should not happen.");
  }
}

const StateProvider = ({ children }: { children: React.ReactNode }): ReactElement => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  return <GlobalStateContext.Provider value={{ state, dispatch }}>{children}</GlobalStateContext.Provider>;
};

export { GlobalStateContext, StateProvider };
