import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { RootStackParamList, SidebarDrawerParamList, HomeWrapperStackParamList, WalkthroughStackParamList, AuthStackParamList } from './common/types-navigator';
import herofitTheme from './styles/herofitTheme';
import * as Screens from './Screens';

// ROOT First level Navigator, used to determine if the user should go through auth sequence of straight to the app
const RootStack = createStackNavigator<RootStackParamList>();
const RootStackScreen = ({ isSignedIn }) => {
  return <RootStack.Navigator headerMode="none" screenOptions={baseScreenStyle}>
    { isSignedIn 
      ? <RootStack.Screen name="App" component={DrawerScreen} />
      : <RootStack.Screen name="Auth" component={AuthStackScreen} />
    }
  </RootStack.Navigator>
}

// IN AUTH Second level Navigator, used for App Auth
const AuthStack = createStackNavigator<AuthStackParamList>();
const AuthStackScreen = () =>{
  return <AuthStack.Navigator headerMode="none" screenOptions={baseScreenStyle}>
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
const SidebarDrawer = createDrawerNavigator<SidebarDrawerParamList>();
const DrawerScreen = () =>{
  return <SidebarDrawer.Navigator headerMode="none" screenOptions={baseScreenStyle}>
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
  return  <HomeWrapperStack.Navigator headerMode="none" screenOptions={baseScreenStyle} >
    <SidebarDrawer.Screen name="Home" component={Screens.Home} options={{ title : 'Home' }} /> 
  </HomeWrapperStack.Navigator>
};



// IN APP Fourth level Navigator, used for Select Hero sequence for new users
const WalkthroughStack = createStackNavigator<WalkthroughStackParamList>();
const WalkthroughStackScreen = () =>{
  
  return  <WalkthroughStack.Navigator headerMode="none" screenOptions={baseScreenStyle} >
    {/* <WalkthroughStack.Screen name="SelectCampaign" component={SelectCampaign}  options={{ title : 'Select Campaign' }} />
    <WalkthroughStack.Screen name="RecordActivities" component={RecordActivities}  options={{ title : 'Record Activities' }} />
    <WalkthroughStack.Screen name="GoToBattle" component={GoToBattle}  options={{ title : 'Go To Battle' }} />
    <WalkthroughStack.Screen name="UseInventory" component={UseInventory}  options={{ title : 'Use Inventory' }} /> */}
  </WalkthroughStack.Navigator>
};

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