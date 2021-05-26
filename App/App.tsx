import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { store, IStore } from './store';
import { SignIn, Home, SelectHeroHowTo, SelectHero, HeroDetails, FinalizeHeroSelection, SpendQP, Loading } from './Screens';
import { getLsWithExpiry, setLsWithExpiry } from './common/helperFunction';

// First level Navigator, used to determine if the user should go through auth sequence of straight to the app
const RootStack = createStackNavigator();
const RootStackScreen = ({  }) =>{
  return <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="Auth" component={AuthStackScreen} />
    <RootStack.Screen name="App" component={DrawerScreen} />

  </RootStack.Navigator>
}

// Second level Navigator, used for directing users who are already authorized
const Drawer = createDrawerNavigator();
const DrawerScreen = () =>{
  const { dispatch, state } = useContext<IStore>(store);
  console.log('THE STATE', state);
  return <Drawer.Navigator>
    {
      state.isLoading ? <Drawer.Screen name="Loading" component={Loading} />
      :  <Drawer.Screen name="Home" component={Home}  options={{ title : 'Home' }} /> 
    }
  
  </Drawer.Navigator>
}

// STILL NEED TO WORK THIS OUT IN MY HEAD.... HOW WILL THE DRAWER NAV & the various modal stacks (Walkthrough) work together??
// Third level Navigator, used for Everything under HOME
const HomeWrapperStack = createStackNavigator();
const HomeWrapperScreen = () => {
  return  <HomeWrapperStack.Navigator >

  </HomeWrapperStack.Navigator>
};




// Second level Navigator, used for App Auth
const AuthStack = createStackNavigator();
const AuthStackScreen = () =>{
  const { dispatch, state } = useContext<IStore>(store);
  return <AuthStack.Navigator headerMode="none">
    {
      state.newUser ? <SelectHeroStack.Screen name="SelectHero" component={SelectHeroStackScreen} />
      : <AuthStack.Screen name="SignIn" component={SignIn}  options={{ title : 'Sign In' }} />
    }
  </AuthStack.Navigator>
};


// Third level Navigator, used for Select Hero sequence for new users
const SelectHeroStack = createStackNavigator();
const SelectHeroStackScreen = () =>{
  const { dispatch, state } = useContext<IStore>(store);
  
  return  <SelectHeroStack.Navigator >
    <SelectHeroStack.Screen name="SelectHeroHowTo" component={SelectHeroHowTo}  options={{ title : 'Select Hero' }} />
    <SelectHeroStack.Screen name="SelectHero" component={SelectHero}  options={{ title : 'Select Hero' }} />
    <SelectHeroStack.Screen name="HeroDetails" component={HeroDetails} options={HeroDetails.navigationOptions}  options={{ title : 'Hero Details' }} />
    <SelectHeroStack.Screen name="FinalizeHeroSelection" component={FinalizeHeroSelection}  options={{ title : 'Finalize Hero Selection' }} />
  </SelectHeroStack.Navigator>
};




const App: React.FC<AppProps> = ({}) => {
  const { dispatch, state } = useContext<IStore>(store);


  useEffect(() =>{
    // Simulate Loading
    setTimeout(() =>{
      dispatch({type : 'APP LOADING', payload : { isLoading : false } });
    },1500);
  }, []);

  useEffect(() =>{
    console.log('JWT - ', state.jwt);   
    const token : Promise<any> = getLsWithExpiry('herofit-jwt');
    token.then((jwt) =>{
      console.log('here jwt', jwt);
      // token exists locally, check if valid on server
      if(jwt){
        const serverValidated : boolean = true;
        setTimeout(() =>{
          if(serverValidated){
            console.log('server says valid, renew locally');
            dispatch({type: 'SET LOCAL JWT', payload: { jwt: '123-xyz'}});
          }
        }, 1000);
      // Token doesn't exist locally, get new one
      }else{
        const serverGaveNewToken : boolean = false;
        if(serverGaveNewToken){
          setTimeout(() =>{
            console.log('server gave new token, save locally');
            dispatch({type: 'SET LOCAL JWT', payload: { jwt: '123-xyz'}});
          }, 1000);
        }else{
          dispatch({type: 'NEW USER'});
        }
      }
    });
  }, [state.jwt]);

  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>  
  )

}

export default App;

