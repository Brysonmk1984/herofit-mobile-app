import React, {createContext, useReducer, Context, FC, ReactElement } from 'react';
import { Store, Action, Hero, SnackBarAlert, AppState, AppDispatch, AppAction } from './common/types';

const initialState : AppState = { isLoading : true, isSignedIn : false, newUser : false, hero : null, alerts : [], jwt : null };

const GlobalStateContext = createContext(initialState);

function appStateReducer(state : AppState, action : AppAction) : AppState {

  switch(action.type) {
    case 'TOGGLE LOADING': {
      console.log('TOGGLE LOAD', action.payload);
      const { isLoading } = action.payload;
      if(typeof isLoading === 'undefined'){
        return Object.assign({}, state, { isLoading : !state.isLoading });
      }
      return Object.assign({}, state, { isLoading });
    }
    case 'SET EXISTING USER INIT DATA': {
      const { user, hero, gameItems, latestBattle, isSignedIn } = action.payload;
      return { ...state, ...{ user, hero, gameItems, latestBattle, isSignedIn } };
    }
    case 'SET ISSIGNEDIN': {
      const { isSignedIn } = action.payload;
      return { ...state, isSignedIn };
    }
    case 'SET NEW USER': {
      const { newUser } = action.payload;
      return { ...state, newUser };
    }
    case 'SET HERO': {
      const { hero } = action.payload;
      return { ...state, hero };
    }
    case 'SET USER': {
      const { user } = action.payload;
      return { ...state, user };
    }
    case 'SET ALERTS': {
      const { alerts }  = action.payload;
      return { ...state, alerts : [...alerts] };
    }
    case 'RESET DEFAULTS': {
      return { ...state, isLoading : false, isSignedIn : false, hero : null, user : null  };
    }
    case 'REMOVE ALERTS': {
      const { indiciesForRemoval } = action.payload;
      return { ...state, alerts : 
        state.alerts.filter((alert) => {
          return !indiciesForRemoval.includes(alert.index);
        })
      };
    }
    default:
      throw new Error('In Store default, should not happen.');
  };

}

const StateProvider : FC = ( { children } ) : ReactElement  => {
  
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  //const providerValue : { state : AppState, dispatch : AppDispatch } = { state, dispatch };
  console.log('STATE', state);
  return (
    <GlobalStateContext.Provider value={ { state, dispatch } }>
      {children}
    </GlobalStateContext.Provider>
  );
};

export { GlobalStateContext, StateProvider }