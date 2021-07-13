import React, {createContext, useReducer} from 'react';
import { getLsWithExpiry, setLsWithExpiry } from './common/helperFunctions';


interface IStore {
  isLoading : boolean;
  jwt : string | null;
  newUser : boolean;
  hero : object | null;
}

const initialState : IStore = { isLoading : true, jwt : null, newUser : false, hero : null };


const store = createContext<IStore>(initialState);
const { Provider } = store;

interface Action {
  type : string;
  payload : object;
}



const StateProvider : React.FC = ( { children } ) => {
  const [state, dispatch] = useReducer((state : IStore, action : Action) => {
    switch(action.type) {
      case 'TOGGLE LOADING':
        const { isLoading } : { isLoading : boolean | undefined } = action.payload;
        if(typeof isLoading === 'undefined'){
          return Object.assign({}, state, { isLoading : !state.isLoading });
        }
        return Object.assign({}, state, { isLoading });

      case 'SET LOCAL JWT':
        const jwt = action.payload.jwt;
        // expire after 7 days
        setLsWithExpiry('herofit-jwt', jwt, 6.048e+8);
        return { ...state, jwt };

      case 'SET NEW USER':
        const { newUser } = action.payload;
        return { ...state, newUser };

      case 'SET HERO':
        const { hero } : { hero : object } = action.payload;
        return { ...state, hero };

      case 'SET USER':
        const { user } : { alerts : object } = action.payload;
        return { ...state, user };

      case 'SET ALERTS':
        const { alerts } : { alerts : array } = action.payload;
        return { ...state, alerts };

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

export { store, StateProvider, IStore }