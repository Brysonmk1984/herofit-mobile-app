import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import herofitTheme from "./styles/herofitTheme";
import * as Screens from "./Screens";
import { AuthStackParamList } from "./common/types-navigator";
import { GlobalStateContext } from "./store";

// IN AUTH used for App Auth
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AuthStackScreen = () => {
  const { state } = useContext(GlobalStateContext);
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, ...baseScreenStyle }}>
      {/* Load Register first if coming from homescreen via Signup process */}
      {state.initialHomescreenLoad === "Register" ? (
        <>
          <AuthStack.Screen name="Register" component={Screens.Register} />
          <AuthStack.Screen name="Splash" component={Screens.Splash} />
        </>
      ) : (
        <>
          <AuthStack.Screen name="Splash" component={Screens.Splash} />
          <AuthStack.Screen name="Register" component={Screens.Register} />
        </>
      )}

      <AuthStack.Screen name="SignIn" component={Screens.SignIn} />
      <AuthStack.Screen name="ForgotPassword" component={Screens.ForgotPassword} />
      <AuthStack.Screen name="AboutGame" component={Screens.AboutGame} options={{ title: "The Game" }} />
      <AuthStack.Screen name="SelectHero" component={Screens.SelectHero} options={{ title: "Select Hero" }} />
      <AuthStack.Screen name="HeroDetails" component={Screens.HeroDetails} options={{ title: "Hero Details" }} />
      <AuthStack.Screen name="SpendQP" component={Screens.SpendQP} options={{ title: "Quantum Points" }} />
    </AuthStack.Navigator>
  );
};

const MainStack = createNativeStackNavigator<AuthStackParamList>();
const MainStackScreen = () => {
  const { state } = useContext(GlobalStateContext);
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false, ...baseScreenStyle }}>
      {/* Accessed from the homescreen */}

      {state.latestBattle ? (
        <>
          <MainStack.Screen name="BattleReport" component={Screens.BattleReport} initialParams={{ battleReport: state.latestBattle }} />
          <MainStack.Screen name="Home" component={Screens.Home} />
        </>
      ) : (
        <>
          <MainStack.Screen name="Home" component={Screens.Home} />
          <MainStack.Screen name="BattleReport" component={Screens.BattleReport} />
        </>
      )}

      {state.initialHomescreenLoad !== "Home" && <MainStack.Screen name="SpendQP" component={Screens.SpendQP} options={{ title: "Quantum Points" }} />}
      <MainStack.Screen name="Activity" component={Screens.Activity} />
      <MainStack.Screen name="AwaitingBattle" component={Screens.AwaitingBattle} />
      <MainStack.Screen name="BattleReportOutcome" component={Screens.BattleReportOutcome} />
      <MainStack.Screen name="BattleReportDetail" component={Screens.BattleReportDetail} />

      {/* Accessed from the Sidebar */}
      <MainStack.Screen name="Adversaries" component={Screens.Adversaries} />
      <MainStack.Screen name="Feedback" component={Screens.Feedback} />
      <MainStack.Screen name="Settings" component={Screens.Settings} />
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
};
