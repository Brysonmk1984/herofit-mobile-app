import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import herofitTheme from "./styles/herofitTheme";
import * as Screens from "./Screens";
import { AuthStackParamList } from "./common/types-navigator";
import { GlobalStateContext } from "./store";
import Constants from "expo-constants";

// IN AUTH used for App Auth
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AuthStackScreen = () => {
  const { state } = useContext(GlobalStateContext);
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: true, headerTintColor: "#d4af37", ...baseScreenStyle }}>
      {/* Load Register first if coming from homescreen via Signup process */}
      {state.initialHomescreenLoad === "Register" ? (
        <>
          <AuthStack.Screen name="Register" component={Screens.Register} options={{ title: "", headerStyle: { backgroundColor: "transparent" } }} />
          <AuthStack.Screen name="Splash" component={Screens.Splash} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <AuthStack.Screen name="Splash" component={Screens.Splash} options={{ headerShown: false }} />
          <AuthStack.Screen name="Register" component={Screens.Register} options={{ headerShown: false }} />
        </>
      )}

      <AuthStack.Screen name="SignIn" component={Screens.SignIn} options={{ headerShown: false }} />
      <AuthStack.Screen name="ForgotPassword" component={Screens.ForgotPassword} options={{ title: "", headerStyle: { backgroundColor: "transparent" } }} />
      <AuthStack.Screen name="AboutGame" component={Screens.AboutGame} options={{ title: "", headerStyle: { backgroundColor: "transparent" } }} />
      <AuthStack.Screen name="SelectHero" component={Screens.SelectHero} options={{ title: "", headerStyle: { backgroundColor: "transparent" } }} />
      <AuthStack.Screen name="HeroDetails" component={Screens.HeroDetails} options={{ title: "", headerStyle: { backgroundColor: "transparent" } }} />
      <AuthStack.Screen name="SpendQP" component={Screens.SpendQP} options={{ title: "", headerStyle: { backgroundColor: "transparent" } }} />
    </AuthStack.Navigator>
  );
};

const MainStack = createNativeStackNavigator<AuthStackParamList>();
const MainStackScreen = () => {
  const { state } = useContext(GlobalStateContext);
  return (
    <MainStack.Navigator screenOptions={{ headerShown: Constants.platform.ios ? true : false, headerTintColor: "#d4af37", ...baseScreenStyle }}>
      {/* Accessed from the homescreen */}

      {state.latestBattle ? (
        <>
          <MainStack.Screen
            name="BattleReport"
            component={Screens.BattleReport}
            initialParams={{ battleReport: state.latestBattle }}
            options={{
              headerShown: false,
            }}
          />
          <MainStack.Screen
            name="Home"
            component={Screens.Home}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <MainStack.Screen
            name="Home"
            component={Screens.Home}
            options={{
              headerShown: false,
            }}
          />
          <MainStack.Screen
            name="BattleReport"
            component={Screens.BattleReport}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}

      {state.initialHomescreenLoad !== "Home" && <MainStack.Screen name="SpendQP" component={Screens.SpendQP} options={{ title: "" }} />}
      <MainStack.Screen name="Activity" component={Screens.Activity} options={{ title: "" }} />
      <MainStack.Screen
        name="AwaitingBattle"
        component={Screens.AwaitingBattle}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name="BattleReportOutcome"
        component={Screens.BattleReportOutcome}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name="BattleReportDetail"
        component={Screens.BattleReportDetail}
        options={{
          headerShown: false,
        }}
      />

      {/* Accessed from the Sidebar */}
      <MainStack.Screen name="Adversaries" component={Screens.Adversaries} options={{ title: "" }} />
      <MainStack.Screen name="Feedback" component={Screens.Feedback} options={{ title: "" }} />
      <MainStack.Screen name="Settings" component={Screens.Settings} options={{ title: "" }} />
    </MainStack.Navigator>
  );
};

export { AuthStackScreen, MainStackScreen };

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
  headerTransparent: true,
};
