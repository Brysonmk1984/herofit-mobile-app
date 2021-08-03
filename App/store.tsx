import React, {createContext, useReducer, Context} from 'react';
import { Store, Action, Hero, SnackBarAlert } from './common/types';

interface InitialState {
  isLoading : boolean, isSignedIn : boolean, newUser : boolean, hero : null | Hero, alerts : SnackBarAlert[]
}
const initialState : InitialState = { isLoading : true, isSignedIn : false, newUser : false, hero : null, alerts : [] };

const store: Context<Store> = createContext(initialState);
const { Provider } = store;

const StateProvider : React.FC = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {

    switch(action.type) {
      case 'TOGGLE LOADING': {

        console.log('TOGLOAD', action.payload);
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
  }, initialState);

  return (
    <Provider value={{ state, dispatch }}>
      {children}
    </Provider>
  );
};

export { store, StateProvider }