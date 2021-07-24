import React, {createContext, useReducer} from 'react';
import { IStore, IAction } from './common/interfaces';

const initialState : IStore = { isLoading : true, isSignedIn : false, newUser : false, hero : null, alerts : [] };
const store = createContext<IStore>(initialState);
const { Provider } = store;

const StateProvider : React.FC = ( { children } ) => {
  const [state, dispatch] = useReducer((state : IStore, action : IAction) => {

    switch(action.type) {
      case 'TOGGLE LOADING': {
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