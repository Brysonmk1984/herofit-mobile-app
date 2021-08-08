import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { loadAsync as fontLoadAsync } from 'expo-font';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { GlobalStateContext } from './store';
import { Store, AppDispatch } from './common/types';
import * as Screens from './Screens';
import { getJwtInLocalStorage } from './common/jwtModule';
import Alerts from './Alerts';
import { LogBox } from 'react-native';
import fetchInitialData from './common/fetchInitialData';

import { SelectHeroStackParamList, RootStackParamList, SidebarDrawerParamList, HomeWrapperStackParamList, WalkthroughStackParamList, AuthStackParamList } from './common/types-navigator';

LogBox.ignoreLogs(['Reanimated 2']);


// ROOT First level Navigator, used to determine if the user should go through auth sequence of straight to the app
const RootStack = createStackNavigator<RootStackParamList>();
const RootStackScreen = ({ isSignedIn }) =>{
  return <RootStack.Navigator headerMode="none">
    { isSignedIn ? <RootStack.Screen name="App" component={DrawerScreen} />
      : <RootStack.Screen name="Auth" component={AuthStackScreen} />
    }
  </RootStack.Navigator>
}


// IN APP Second level Navigator, used for directing users who are already authorized
const SidebarDrawer = createDrawerNavigator<SidebarDrawerParamList>();
const DrawerScreen = () =>{
  const { state, dispatch } = useContext<Store>(GlobalStateContext);

  return <SidebarDrawer.Navigator>
    <SidebarDrawer.Screen name="HomeWrapperScreen" component={HomeWrapperScreen} />
    <SidebarDrawer.Screen name="Profile" component={Screens.Profile} />
    <SidebarDrawer.Screen name="Ranking" component={Screens.Ranking} />
    <SidebarDrawer.Screen name="Campaign" component={Screens.Campaign} />
    <SidebarDrawer.Screen name="Inventory" component={Screens.Inventory} />
    <SidebarDrawer.Screen name="Items" component={Screens.Items} />
    <SidebarDrawer.Screen name="Feedback" component={Screens.Feedback} />
    <SidebarDrawer.Screen name="Settings" component={Screens.Settings} />
  </SidebarDrawer.Navigator>
}


// IN APP Third level Navigator, used for Everything under HOME
const HomeWrapperStack = createStackNavigator<HomeWrapperStackParamList>();
const HomeWrapperScreen = () => {
  const { state, dispatch } = useContext<Store>(GlobalStateContext);
  return  <HomeWrapperStack.Navigator >
    <SidebarDrawer.Screen name="Home" component={Screens.Home} options={{ title : 'Home' }} /> 
  </HomeWrapperStack.Navigator>
};



// IN APP Fourth level Navigator, used for Select Hero sequence for new users
const WalkthroughStack = createStackNavigator<WalkthroughStackParamList>();
const WalkthroughStackScreen = () =>{
  const { state, dispatch } = useContext<Store>(GlobalStateContext);
  
  return  <WalkthroughStack.Navigator >
    {/* <WalkthroughStack.Screen name="SelectCampaign" component={SelectCampaign}  options={{ title : 'Select Campaign' }} />
    <WalkthroughStack.Screen name="RecordActivities" component={RecordActivities}  options={{ title : 'Record Activities' }} />
    <WalkthroughStack.Screen name="GoToBattle" component={GoToBattle}  options={{ title : 'Go To Battle' }} />
    <WalkthroughStack.Screen name="UseInventory" component={UseInventory}  options={{ title : 'Use Inventory' }} /> */}
  </WalkthroughStack.Navigator>
};

// AUTH Second level Navigator, used for App Auth
const AuthStack = createStackNavigator<AuthStackParamList>();
const AuthStackScreen = () =>{
  const { state, dispatch } = useContext<Store>(GlobalStateContext);
  return <AuthStack.Navigator headerMode="none">
    {
      state.newUser ? <SelectHeroStack.Screen name="SelectHero" component={SelectHeroStackScreen} />
      : <AuthStack.Screen name="SignIn" component={Screens.SignIn}  options={{ title : 'Sign In' }} />
    }
    <AuthStack.Screen name="Register" component={Screens.Register}  options={{ title : 'Register' }} />
  </AuthStack.Navigator>
};



// AUTH Third level Navigator, used for Select Hero sequence for new users
const SelectHeroStack = createStackNavigator<SelectHeroStackParamList>();
const SelectHeroStackScreen = () =>{
  const { state, dispatch } = useContext<Store>(GlobalStateContext);
  
  return  <SelectHeroStack.Navigator >
    <SelectHeroStack.Screen name="SelectHeroHowTo" component={Screens.SelectHeroHowTo}  options={{ title : 'Select Hero' }} />
    <SelectHeroStack.Screen name="SelectHero" component={Screens.SelectHero}  options={{ title : 'Select Hero' }} />
    <SelectHeroStack.Screen name="HeroDetails" component={Screens.HeroDetails} options={{ title : 'Hero Details' }} />
    <SelectHeroStack.Screen name="FinalizeHeroSelection" component={Screens.FinalizeHeroSelection}  options={{ title : 'Finalize Hero Selection' }} />
    <SelectHeroStack.Screen name="SpendQP" component={Screens.SpendQP}  options={{ title : 'Quantum Points' }} />
  </SelectHeroStack.Navigator>
};




const App: React.FC<AppProps> = ({}) => {
  const { state, dispatch } = useContext<Store>(GlobalStateContext);
  


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

 

      if(token){
        await fetchInitialData(token, dispatch, state);
      }
      dispatch({type : 'TOGGLE LOADING', payload : { isLoading : false } });
    })();
  }, []);

  

  return (
    <NavigationContainer>
      {
        state.isLoading ? <Screens.Loading />
        : <RootStackScreen isSignedIn={state.isSignedIn} />
      }
      { state.alerts.length ? <Alerts alerts={state.alerts} dispatch={dispatch} />  : null }
    </NavigationContainer>
  )

}

export default App;

