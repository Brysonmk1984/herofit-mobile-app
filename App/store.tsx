import React, { createContext, useReducer, Context, FC, ReactElement } from "react";
import { InitialAppState, AppAction } from "./common/types";

const initialState: InitialAppState = { isLoading: true, isSignedIn: false, userStatus: "new", user: null, hero: null, latestSavedActivities: [], latestSavedActivityDate: null, latestBattle: null, jwt: null, modalQueue: [], allGameItems: [], inventory: { pets: [], consumables: [], skins: [], titles: [], codices: [] }, equipped: { skin: null, pet: null, title: null }, initialHomescreenLoad: null, background: null };

type AppState = typeof initialState;

const GlobalStateContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> }>({ state: initialState, dispatch: () => {} });

function appStateReducer(state: AppState, action: AppAction): AppState {
  console.log("IN REDUCTER");
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
      const { isSignedIn, initialHomescreenLoad } = action.payload;
      const updatedState = { ...state, isSignedIn };
      if (typeof initialHomescreenLoad !== "undefined") {
        updatedState.initialHomescreenLoad = initialHomescreenLoad;
      }
      return updatedState;
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
    case "RESET DEFAULTS": {
      return { ...state, isLoading: false, hero: null, user: null };
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
    case "POST UPGRADE": {
      const { hero, latestSavedActivities } = action.payload;
      return { ...state, hero, latestSavedActivities };
    }
    case "SEEN BATTLE REPORT": {
      const { latestBattle } = action.payload;
      return { ...state, latestBattle };
    }
    case "UPDATE INVENTORY": {
      const { inventory } = action.payload;
      return { ...state, inventory };
    }
    case "UPDATE EQUIPPED": {
      const { equipped } = action.payload;
      return { ...state, equipped };
    }
    case "UPDATE LATEST BATTLE": {
      const { latestBattle } = action.payload;
      return { ...state, latestBattle };
    }
    // Needed to switch Navigators when users are first going to Homescreen from SpendQP
    case "SET INITIAL HOMESCREEN LOAD": {
      const { initialHomescreenLoad } = action.payload;
      return { ...state, initialHomescreenLoad };
    }
    case "SET BACKGROUND": {
      const { background } = action.payload;
      return { ...state, background };
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
