import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { store } from './store';
import { IStore } from './common/interfaces';
import * as Screens from './Screens';
import { getJwtInLocalStorage } from './common/jwtModule';
import Alerts from './Alerts';
import { LogBox } from 'react-native';
import fetchInitialData from './common/fetchInitialData';

LogBox.ignoreLogs(['Reanimated 2']);

// ROOT First level Navigator, used to determine if the user should go through auth sequence of straight to the app
const RootStack = createStackNavigator();
const RootStackScreen = ({ isSignedIn }) =>{
  return <RootStack.Navigator headerMode="none">
    { isSignedIn ? <RootStack.Screen name="App" component={DrawerScreen} />
      : <RootStack.Screen name="Auth" component={AuthStackScreen} />
    }
  </RootStack.Navigator>
}

// IN APP Second level Navigator, used for directing users who are already authorized
const Drawer = createDrawerNavigator();
const DrawerScreen = () =>{
  const { state, dispatch } = useContext<IStore>(store);

  return <Drawer.Navigator>
    <Drawer.Screen name="HomeWrapperScreen" component={HomeWrapperScreen} />
    <Drawer.Screen name="Profile" component={Screens.Profile} />
    <Drawer.Screen name="Ranking" component={Screens.Ranking} />
    <Drawer.Screen name="Campaign" component={Screens.Campaign} />
    <Drawer.Screen name="Inventory" component={Screens.Inventory} />
    <Drawer.Screen name="Items" component={Screens.Items} />
    <Drawer.Screen name="Feedback" component={Screens.Feedback} />
    <Drawer.Screen name="Settings" component={Screens.Settings} />
  </Drawer.Navigator>
}

// STILL NEED TO WORK THIS OUT IN MY HEAD.... HOW WILL THE DRAWER NAV & the various modal stacks (Walkthrough) work together??
// IN APP Third level Navigator, used for Everything under HOME
const HomeWrapperStack = createStackNavigator();
const HomeWrapperScreen = () => {
  const { state, dispatch } = useContext<IStore>(store);
  return  <HomeWrapperStack.Navigator >
    <Drawer.Screen name="Home" component={Screens.Home} options={{ title : 'Home' }} /> 
  </HomeWrapperStack.Navigator>
};

// IN APP Fourth level Navigator, used for Select Hero sequence for new users
const WalkthroughStack = createStackNavigator();
const WalkthroughStackScreen = () =>{
  const { state, dispatch } = useContext<IStore>(store);
  
  return  <WalkthroughStack.Navigator >
    {/* <WalkthroughStack.Screen name="SelectCampaign" component={SelectCampaign}  options={{ title : 'Select Campaign' }} />
    <WalkthroughStack.Screen name="RecordActivities" component={RecordActivities}  options={{ title : 'Record Activities' }} />
    <WalkthroughStack.Screen name="GoToBattle" component={GoToBattle}  options={{ title : 'Go To Battle' }} />
    <WalkthroughStack.Screen name="UseInventory" component={UseInventory}  options={{ title : 'Use Inventory' }} /> */}
  </WalkthroughStack.Navigator>
};





// AUTH Second level Navigator, used for App Auth
const AuthStack = createStackNavigator();
const AuthStackScreen = () =>{
  const { state, dispatch } = useContext<IStore>(store);
  return <AuthStack.Navigator headerMode="none">
    {
      state.newUser ? <SelectHeroStack.Screen name="SelectHero" component={SelectHeroStackScreen} />
      : <AuthStack.Screen name="SignIn" component={Screens.SignIn}  options={{ title : 'Sign In' }} />
    }
    <AuthStack.Screen name="Register" component={Screens.Register}  options={{ title : 'Register' }} />
  </AuthStack.Navigator>
};


// AUTH Third level Navigator, used for Select Hero sequence for new users
const SelectHeroStack = createStackNavigator();
const SelectHeroStackScreen = () =>{
  const { state, dispatch } = useContext<IStore>(store);
  
  return  <SelectHeroStack.Navigator >
    <SelectHeroStack.Screen name="SelectHeroHowTo" component={Screens.SelectHeroHowTo}  options={{ title : 'Select Hero' }} />
    <SelectHeroStack.Screen name="SelectHero" component={Screens.SelectHero}  options={{ title : 'Select Hero' }} />
    <SelectHeroStack.Screen name="HeroDetails" component={Screens.HeroDetails} options={Screens.HeroDetails.navigationOptions}  options={{ title : 'Hero Details' }} />
    <SelectHeroStack.Screen name="FinalizeHeroSelection" component={Screens.FinalizeHeroSelection}  options={{ title : 'Finalize Hero Selection' }} />
    <SelectHeroStack.Screen name="SpendQP" component={Screens.SpendQP}  options={{ title : 'Quantum Points' }} />
  </SelectHeroStack.Navigator>
};




const App: React.FC<AppProps> = ({}) => {
  const { state, dispatch } = useContext<IStore>(store);
  


  useEffect(() => {
    (async () =>{
      const token = await getJwtInLocalStorage();
      if(token){
        console.log('THE TOKK', token, state);
        await fetchInitialData(token, dispatch, state);
      }
      dispatch({type : 'TOGGLE LOADING', payload : { isLoading : false } });
    })()

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

