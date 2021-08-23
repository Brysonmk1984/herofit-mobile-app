import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { RootStackParamList, SidebarDrawerParamList, AuthStackParamList } from './common/types-navigator';
import herofitTheme from './styles/herofitTheme';
import * as Screens from './Screens';
import { Drawer } from '@material-ui/core';

// ROOT First level Navigator, used to determine if the user should go through auth sequence of straight to the app
const RootStack = createStackNavigator();
const RootStackScreen = ({ isSignedIn }) => {
  return <RootStack.Navigator screenOptions={{headerShown : false, ...baseScreenStyle}}>
    { isSignedIn 
      ? <RootStack.Screen name="App" component={DrawerScreen} />
      : <RootStack.Screen name="Auth" component={AuthStackScreen} />
    }
  </RootStack.Navigator>
}

// IN AUTH Second level Navigator, used for App Auth
const AuthStack = createStackNavigator();
const AuthStackScreen = () =>{
  return <AuthStack.Navigator screenOptions={{headerShown : false, ...baseScreenStyle}}>
    <AuthStack.Screen name="SignIn" component={Screens.SignIn} />
    <AuthStack.Screen name="Register" component={Screens.Register} />
    <AuthStack.Screen name="SelectHeroHowTo" component={Screens.SelectHeroHowTo}  options={{ title : 'Select Hero' }} />
    <AuthStack.Screen name="SelectHero" component={Screens.SelectHero}  options={{ title : 'Select Hero' }} />
    <AuthStack.Screen name="HeroDetails" component={Screens.HeroDetails} options={{ title : 'Hero Details' }} />
    <AuthStack.Screen name="FinalizeHeroSelection" component={Screens.FinalizeHeroSelection}  options={{ title : 'Finalize Hero Selection' }} />
    <AuthStack.Screen name="SpendQP" component={Screens.SpendQP}  options={{ title : 'Quantum Points' }} />
  </AuthStack.Navigator>
};

// IN APP Second level Navigator, used for directing users who are already authorized
const SidebarDrawer = createDrawerNavigator();
const DrawerScreen = () =>{
  return <SidebarDrawer.Navigator screenOptions={{headerShown : false, ...baseScreenStyle}}>
    <SidebarDrawer.Screen name="Home" component={Screens.Home} />
    <SidebarDrawer.Screen name="Profile" component={Screens.Profile} />
    <SidebarDrawer.Screen name="Ranking" component={Screens.Ranking} />
    <SidebarDrawer.Screen name="Campaign" component={Screens.Campaign} />
    <SidebarDrawer.Screen name="Inventory" component={Screens.Inventory} />
    <SidebarDrawer.Screen name="Items" component={Screens.Items} />
    <SidebarDrawer.Screen name="Feedback" component={Screens.Feedback} />
    <SidebarDrawer.Screen name="Settings" component={Screens.Settings} /> 
  </SidebarDrawer.Navigator>
}

export default RootStackScreen;

/*
  STYLES
*/
const { background, white } = herofitTheme.colors.base;
const baseScreenStyle = {
  cardStyle: { 
    backgroundColor: white,
    borderBottomWidth:1,
    borderBottomColor: background
  }
}