import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import herofitTheme from "./styles/herofitTheme";
import * as Screens from "./Screens";
import { AuthStackParamList, MainDrawerParamList, RootStackParamList } from "./common/types-navigator";
import { DrawerIndicator } from "./Components/DrawerIndicator";
import { AntDesign } from "@expo/vector-icons";
import { Icon } from "native-base";
// ROOT First level Navigator, used to determine if the user should go through auth sequence of straight to the app
// TS - Ben doesn't pass a generic here, but the docs do.
const RootStack = createStackNavigator<RootStackParamList>();
const RootStackScreen = ({ isSignedIn }) => {
  return <RootStack.Navigator screenOptions={{ headerShown: false, ...baseScreenStyle }}>{isSignedIn ? <RootStack.Screen name="App" component={DrawerScreen} /> : <RootStack.Screen name="Auth" component={AuthStackScreen} />}</RootStack.Navigator>;
};

// IN AUTH Second level Navigator, used for App Auth
const AuthStack = createStackNavigator<AuthStackParamList>();
const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, ...baseScreenStyle }}>
      <AuthStack.Screen name="Splash" component={Screens.Splash} />
      <AuthStack.Screen name="SignIn" component={Screens.SignIn} />
      <AuthStack.Screen name="Register" component={Screens.Register} />
      <AuthStack.Screen name="ForgotPassword" component={Screens.ForgotPassword} />
      <AuthStack.Screen name="AboutGame" component={Screens.AboutGame} options={{ title: "The Game" }} />
      <AuthStack.Screen name="SelectHeroHowTo" component={Screens.SelectHeroHowTo} options={{ title: "Select Hero" }} />
      <AuthStack.Screen name="SelectHero" component={Screens.SelectHero} options={{ title: "Select Hero" }} />
      <AuthStack.Screen name="HeroDetails" component={Screens.HeroDetails} options={{ title: "Hero Details" }} />
      <AuthStack.Screen name="FinalizeHeroSelection" component={Screens.FinalizeHeroSelection} options={{ title: "Finalize Hero Selection" }} />
      <AuthStack.Screen name="SpendQP" component={Screens.SpendQP} options={{ title: "Quantum Points" }} />
      <MainDrawer.Screen name="Home" component={Screens.Home} />
    </AuthStack.Navigator>
  );
};

function filterDrawerContent(props) {
  const filteredProps = {
    ...props,
    state: {
      ...props.state,
      routeNames: props.state.routeNames.filter(
        // To hide single option
        // (routeName) => routeName !== 'HiddenPage1',
        // To hide multiple options you can add & condition
        routeName => {
          routeName !== "SpendQP" && routeName !== "HiddenPage2";
        },
      ),
      routes: props.state.routes.filter(route => route.name !== "SpendQP" && route.name !== "HiddenPage2"),
    },
  };
  return (
    <DrawerContentScrollView {...filteredProps}>
      <DrawerItemList {...filteredProps} />
    </DrawerContentScrollView>
  );
}

// IN APP Second level Navigator, used for directing users who are already authorized
const MainDrawer = createDrawerNavigator<MainDrawerParamList>();
const DrawerScreen = () => {
  return (
    <MainDrawer.Navigator drawerContent={props => filterDrawerContent(props)} drawerPosition="right" screenOptions={{ headerShown: false, ...baseScreenStyle }}>
      <MainDrawer.Screen options={{ drawerIcon: ({ focused, size }) => <Icon as={AntDesign} name="home" size={10} color="base.link" /> }} name="Home" component={Screens.Home} />
      <MainDrawer.Screen name="Profile" component={Screens.Profile} />
      <MainDrawer.Screen name="Ranking" component={Screens.Ranking} />
      <MainDrawer.Screen name="Campaign" component={Screens.Campaign} />
      <MainDrawer.Screen name="Inventory" component={Screens.Inventory} />
      <MainDrawer.Screen name="Items" component={Screens.Items} />
      <MainDrawer.Screen name="Feedback" component={Screens.Feedback} />
      <MainDrawer.Screen name="Settings" component={Screens.Settings} />
      <MainDrawer.Screen name="SpendQP" component={Screens.SpendQP} options={{ title: "Quantum Points" }} />
      <MainDrawer.Screen name="ManualActivity" component={Screens.ManualActivity} />
    </MainDrawer.Navigator>
  );
};

export default RootStackScreen;

/*
  STYLES
*/
const { background, white } = herofitTheme.colors.base;
const baseScreenStyle = {
  cardStyle: {
    backgroundColor: white,
    borderBottomWidth: 1,
    borderBottomColor: background,
  },
};
