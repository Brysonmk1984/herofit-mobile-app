import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { store, IStore } from './store';
import { SignIn, Register, Home, SelectHeroHowTo, SelectHero, HeroDetails, FinalizeHeroSelection, SpendQP, Loading } from './Screens/Screens';
import { getJwtInLocalStorage, setJwtInLocalStorage } from './common/jwtModule';

// ROOT First level Navigator, used to determine if the user should go through auth sequence of straight to the app
const RootStack = createStackNavigator();
const RootStackScreen = ({  }) =>{
  return <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="Auth" component={AuthStackScreen} />
    <RootStack.Screen name="App" component={DrawerScreen} />

  </RootStack.Navigator>
}

// IN APP Second level Navigator, used for directing users who are already authorized
const Drawer = createDrawerNavigator();
const DrawerScreen = () =>{
  const { dispatch, state } = useContext<IStore>(store);

  return <Drawer.Navigator>
    {
      state.isLoading ? <Drawer.Screen name="Loading" component={Loading} />
      :  <Drawer.Screen name="HomeWrapperScreen" component={HomeWrapperScreen} />
    }
  
  </Drawer.Navigator>
}

// STILL NEED TO WORK THIS OUT IN MY HEAD.... HOW WILL THE DRAWER NAV & the various modal stacks (Walkthrough) work together??
// IN APP Third level Navigator, used for Everything under HOME
const HomeWrapperStack = createStackNavigator();
const HomeWrapperScreen = () => {
  const { dispatch, state } = useContext<IStore>(store);
  return  <HomeWrapperStack.Navigator >
    {
      state.newUser ? <Drawer.Screen name="WalkthroughStackScreen" component={WalkthroughStackScreen}  options= {{ headerShown: false }} /> 
      : <Drawer.Screen name="Home" component={Home} options={{ title : 'Home' }} /> 
    }
  </HomeWrapperStack.Navigator>
};

// IN APP Fourth level Navigator, used for Select Hero sequence for new users
const WalkthroughStack = createStackNavigator();
const WalkthroughStackScreen = () =>{
  const { dispatch, state } = useContext<IStore>(store);
  
  return  <WalkthroughStack.Navigator >
    <WalkthroughStack.Screen name="SpendQP" component={SpendQP}  options={{ title : 'Quantum Points' }} />
    {/* <WalkthroughStack.Screen name="SelectCampaign" component={SelectCampaign}  options={{ title : 'Select Campaign' }} />
    <WalkthroughStack.Screen name="RecordActivities" component={RecordActivities}  options={{ title : 'Record Activities' }} />
    <WalkthroughStack.Screen name="GoToBattle" component={GoToBattle}  options={{ title : 'Go To Battle' }} />
    <WalkthroughStack.Screen name="UseInventory" component={UseInventory}  options={{ title : 'Use Inventory' }} /> */}
  </WalkthroughStack.Navigator>
};





// AUTH Second level Navigator, used for App Auth
const AuthStack = createStackNavigator();
const AuthStackScreen = () =>{
  const { dispatch, state } = useContext<IStore>(store);
  return <AuthStack.Navigator headerMode="none">
    {
      state.newUser ? <SelectHeroStack.Screen name="SelectHero" component={SelectHeroStackScreen} />
      : <AuthStack.Screen name="SignIn" component={SignIn}  options={{ title : 'Sign In' }} />
    }
    <AuthStack.Screen name="Register" component={Register}  options={{ title : 'Register' }} />
  </AuthStack.Navigator>
};


// AUTH Third level Navigator, used for Select Hero sequence for new users
const SelectHeroStack = createStackNavigator();
const SelectHeroStackScreen = () =>{
  const { dispatch, state } = useContext<IStore>(store);
  
  return  <SelectHeroStack.Navigator >
    <SelectHeroStack.Screen name="SelectHeroHowTo" component={SelectHeroHowTo}  options={{ title : 'Select Hero' }} />
    <SelectHeroStack.Screen name="SelectHero" component={SelectHero}  options={{ title : 'Select Hero' }} />
    <SelectHeroStack.Screen name="HeroDetails" component={HeroDetails} options={HeroDetails.navigationOptions}  options={{ title : 'Hero Details' }} />
    <SelectHeroStack.Screen name="FinalizeHeroSelection" component={FinalizeHeroSelection}  options={{ title : 'Finalize Hero Selection' }} />
    {/* NEED TO ADD REGISTER HERE */}
  </SelectHeroStack.Navigator>
};




const App: React.FC<AppProps> = ({}) => {
  const { dispatch, state } = useContext<IStore>(store);


  useEffect(() =>{
    // Simulate Loading
    setTimeout(() =>{
      dispatch({type : 'TOGGLE LOADING', payload : { isLoading : false } });
    },1500);
  }, []);

  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>  
  )

}

export default App;

