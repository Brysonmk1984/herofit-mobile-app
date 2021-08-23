import React, { useState, useContext, useEffect } from 'react';
import { LogBox, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { GlobalStateContext } from './store';
import RootStackScreen from './Navigator';
import { Loading } from './Screens';
import Alerts from './Alerts';
import debugErrors from './common/debugErrors';
import fetchInitialData from './common/fetchInitialData';
import useJwt from './common/hooks/useJwt';
LogBox.ignoreLogs(['Reanimated 2', 'Remote debugger', 'VirtualizedLists should never be nested']);

const height = Dimensions.get("window").height;
const App: React.FC = () => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [jwt] =  useJwt();
  const [fontsLoaded] = useFonts({
    'icomoon': require('../assets/fonts/icomoon.ttf'),
    'bebas-neue': require('../assets/fonts/BebasNeue-Regular.ttf'),
    'oswald': require('../assets/fonts/Oswald-VariableFont_wght.ttf'),
    'pathway': require('../assets/fonts/PathwayGothicOne-Regular.ttf'),
    // 'pragatiNarrow-bold': require('../assets/fonts/PragatiNarrow-Bold.ttf'),
    // 'pragatiNarrow': require('../assets/fonts/PragatiNarrow-Regular.ttf'),
    'rochester': require('../assets/fonts/Rochester-Regular.ttf')
  });

  // GET INITIAL APP DATA if JWT exists
  useEffect(() => {
    async function initialData(){
      try{
        await fetchInitialData(jwt, dispatch, state);
      }catch(error){
        debugErrors(error);
      }finally{
        dispatch({type : 'TOGGLE LOADING', payload : { isLoading : false } });
      }
    }
    
    if(jwt){
      initialData();
    }
  }, [jwt]);

  return (
    <NavigationContainer>
      <SafeAreaView style={{ height }}>
        {
          state.isLoading && !fontsLoaded ? <Loading />
          : <RootStackScreen isSignedIn={state.isSignedIn} />
        }
        { state.alerts.length ? <Alerts alerts={state.alerts} dispatch={dispatch} />  : null }
      </SafeAreaView>
    </NavigationContainer>
  )
}

export default App;
