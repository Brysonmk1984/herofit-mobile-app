import React, {createContext, useReducer} from 'react';
import { IStore, Action } from './common/interfaces';

const initialState : IStore = { isLoading : true, isSignedIn : null, newUser : false, hero : null, alerts : [] };
const store = createContext<IStore>(initialState);
const { Provider } = store;

const StateProvider : React.FC = ( { children } ) => {
  const [state, dispatch] = useReducer((state : IStore, action : Action) => {
    let isLoading, user, hero, gameItems, latestBattle, isSignedIn, alerts, indiciesForRemoval;

    switch(action.type) {
      case 'TOGGLE LOADING':
        ({ isLoading } = action.payload);
        if(typeof isLoading === 'undefined'){
          return Object.assign({}, state, { isLoading : !state.isLoading });
        }
        return Object.assign({}, state, { isLoading });
      case 'SET EXISTING USER INIT DATA':
        ({ user, hero, gameItems, latestBattle, isSignedIn } = action.payload);
        return { ...state, ...{ user, hero, gameItems, latestBattle, isSignedIn } };
      case 'SET ISSIGNEDIN':
        ({ isSignedIn } = action.payload);
        return { ...state, isSignedIn };
      case 'SET NEW USER':
        ({ newUser } = action.payload);
        return { ...state, newUser };

      case 'SET HERO':
        ({ hero } = action.payload);
        return { ...state, hero };

      case 'SET USER':
        ({ user } = action.payload);
        return { ...state, user };

      case 'SET ALERTS':
        ({ alerts }  = action.payload);
        return { ...state, alerts : [...alerts] };
      case 'REMOVE ALERTS':
        ({ indiciesForRemoval } = action.payload);
        return { ...state, alerts : 
          state.alerts.filter((alert) => {
            return !indiciesForRemoval.includes(alert.index);
          })
        };
      default:
        throw new Error();
    };
  }, initialState);

  return (
    <Provider value={{ state, dispatch }}>
      {children}
    </Provider>
  );
};

export { store, StateProvider }