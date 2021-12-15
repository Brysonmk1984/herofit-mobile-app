import React, { useContext, useEffect } from "react";
import { LogBox } from "react-native";
import { View } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { Logs } from "expo";
import { useFonts } from "expo-font";
import { AuthStackScreen, MainStackScreen } from "./Navigator";
import { GlobalStateContext } from "./store";
import { Loading } from "./Screens";
import useForegroundListener from "./common/hooks/useForegroundListener";
import useAppDataFetch from "./common/hooks/useAppDataFetch";
import LoadingSpinner from "./Components/LoadingSpinner";
import Toast from "react-native-toast-message";
import toastConfig from "./common/toastConfig";
import useInventory from "./common/hooks/useInventory";

LogBox.ignoreLogs(["Reanimated 2", "Remote debugger", "VirtualizedLists should never be nested", 'Expected style "lineHeight: 24" to contain units', 'Expected style "lineHeight: 30" to contain units', 'Expected style "lineHeight: 40" to contain units', 'Expected style "lineHeight: 50" to contain units', 'Expected style "lineHeight: 85" to contain units', 'Expected style "lineHeight: 120" to contain units', "Please pass alt prop to Image component", "Non-serializable values were found in the navigation state", "When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.", "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.", "Sentry Logger [Warn]: SentryError: Native is disabled"]);
Logs.enableExpoCliLogging();

const App: React.FC = () => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { refreshAppData } = useForegroundListener();
  const { getAllAppData, jwt } = useAppDataFetch();
  const { fetchAndUpdateInventory } = useInventory();

  // LOAD CUSTOM FONTS
  const [fontsLoaded] = useFonts({
    icomoon: require("../assets/fonts/icomoon.ttf"),
    "bebas-neue": require("../assets/fonts/BebasNeue-Regular.ttf"),
    oswald: require("../assets/fonts/Oswald-VariableFont_wght.ttf"),
    shadowsIntoLight: require("../assets/fonts/ShadowsIntoLight-Regular.ttf"),
  });

  // DETERMINE WHETHER AUTH STACK OR MAIN STACK WILL BE VISIBLE
  function _determineNavigator(isSignedIn: boolean, initialHomescreenLoad: string) {
    return isSignedIn || initialHomescreenLoad === "Home" ? <MainStackScreen /> : <AuthStackScreen />;
  }

  // GET INITIAL APP DATA if JWT EXISTS
  useEffect(() => {
    if (jwt && !state.isSignedIn) {
      getAllAppData();
    } else {
      const loadingTimeout = setTimeout(() => {
        dispatch({ type: "TOGGLE LOADING", payload: { isLoading: false } });
      }, 1500);
      return () => clearTimeout(loadingTimeout);
    }
  }, [jwt]);

  // REFRESH APP DATA IF APP HAS RETURNED TO THE FOREGROUND
  useEffect(() => {
    // Android for some will run this initially, while ios wont, so hasRunInitJwtCheck is needed
    if (refreshAppData && state.isSignedIn && state.user.active) {
      dispatch({ type: "TOGGLE IN APP LOADING", payload: { isLoadingInApp: true } });
      getAllAppData().then(data => {
        fetchAndUpdateInventory();
      });
    }
  }, [refreshAppData]);

  return (
    <NavigationContainer>
      <View flex={1}>
        {/* If app is loading -> state.isLoading === true
            OR
            If Font have not been loaded  -> fontLoaded === false
            Show loading, otherwise show view
          */}
        {state.isLoading || !fontsLoaded ? <Loading /> : _determineNavigator(state.isSignedIn, state.initialHomescreenLoad)}
      </View>

      {/* RELOADING ON SCREEN */}
      {state.isLoadingInApp && <LoadingSpinner color="base.brand" size="lg" />}
      <Toast position="bottom" config={toastConfig} />
    </NavigationContainer>
  );
};

export default App;
