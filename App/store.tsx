import React, {createContext, useReducer} from 'react';
import { getLsWithExpiry, setLsWithExpiry } from './common/helperFunction';


interface IStore {
  isLoading : boolean;
  jwt : string | null;
  newUser : boolean;
}

const initialState : IStore = { isLoading : true, jwt : null, newUser : false };


const store = createContext<IStore>(initialState);
const { Provider } = store;

interface Action {
  type : string;
  payload : object;
}



const StateProvider : React.FC = ( { children } ) => {
  const [state, dispatch] = useReducer((state : object, action : Action) => {
    switch(action.type) {
      case 'APP LOADING':
        const { isLoading } = action.payload;
        return Object.assign({}, state, { isLoading });
      case 'SET LOCAL JWT':
        const jwt = action.payload.jwt;
        // expire after 7 days
        setLsWithExpiry('herofit-jwt', jwt, 6.048e+8);
        return Object.assign({}, state, { jwt });
      case 'NEW USER':
        return Object.assign({}, state, { newUser : true });
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