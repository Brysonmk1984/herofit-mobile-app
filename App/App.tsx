import React, { useState, useContext, useEffect } from 'react';
import { LogBox, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { loadAsync as fontLoadAsync } from 'expo-font';
import { GlobalStateContext } from './store';
import RootStackScreen from './Navigator';
import { Loading } from './Screens';
import { getJwtInLocalStorage } from './common/jwtModule';
import Alerts from './Alerts';
import fetchInitialData from './common/fetchInitialData';

LogBox.ignoreLogs(['Reanimated 2', 'Remote debugger', 'VirtualizedLists should never be nested']);

const height = Dimensions.get("window").height;
const App: React.FC = () => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // get the JWT and fonts from local storage with async storage, then get initial game data
    (async () =>{
      const [token, p2] = await Promise.all([
        getJwtInLocalStorage(), 
        fontLoadAsync({
          'icomoon': require('../assets/fonts/icomoon.ttf'),
          'bebas-neue': require('../assets/fonts/BebasNeue-Regular.ttf'),
          'oswald': require('../assets/fonts/Oswald-VariableFont_wght.ttf'),
          'pathway': require('../assets/fonts/PathwayGothicOne-Regular.ttf'),
          // 'pragatiNarrow-bold': require('../assets/fonts/PragatiNarrow-Bold.ttf'),
          // 'pragatiNarrow': require('../assets/fonts/PragatiNarrow-Regular.ttf'),
          'rochester': require('../assets/fonts/Rochester-Regular.ttf')
        })
      ]);
      setFontsLoaded(true);

      if(token){
        await fetchInitialData(token, dispatch, state);
      }
      dispatch({type : 'TOGGLE LOADING', payload : { isLoading : false } });
    })();
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaView style={{ height }}>
        {
          state.isLoading || !fontsLoaded ? <Loading />
          : <RootStackScreen isSignedIn={state.isSignedIn} />
        }
        { state.alerts.length ? <Alerts alerts={state.alerts} dispatch={dispatch} />  : null }
      </SafeAreaView>
    </NavigationContainer>
  )
}

export default App;
