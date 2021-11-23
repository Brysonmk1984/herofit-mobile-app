import React, { useContext, useEffect, useRef, useState } from "react";
import { LogBox, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { GlobalStateContext } from "./store";
import { AuthStackScreen, MainStackScreen } from "./Navigator";
import { Loading } from "./Screens";
import debugErrors from "./common/debugErrors";
import fetchInitialData from "./common/fetchInitialData";
import useJwt from "./common/hooks/useJwt";
import { getHeroAlias } from "./common/helperFunctions";
import { View } from "native-base";
import useGlobalToast from "./common/hooks/useGlobalToast";
import { Logs } from "expo";
import * as Linking from "expo-linking";

LogBox.ignoreLogs(["Reanimated 2", "Remote debugger", "VirtualizedLists should never be nested", 'Expected style "lineHeight: 24" to contain units', 'Expected style "lineHeight: 30" to contain units', 'Expected style "lineHeight: 40" to contain units', 'Expected style "lineHeight: 50" to contain units', 'Expected style "lineHeight: 85" to contain units', 'Expected style "lineHeight: 120" to contain units', "Please pass alt prop to Image component", "Non-serializable values were found in the navigation state", "When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.", "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead."]);
//LogBox.ignoreAllLogs(true);

Logs.enableExpoCliLogging();

const height = Dimensions.get("window").height;
const App: React.FC = () => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { addToast } = useGlobalToast();
  const [jwt] = useJwt();
  const [fontsLoaded] = useFonts({
    icomoon: require("../assets/fonts/icomoon.ttf"),
    "bebas-neue": require("../assets/fonts/BebasNeue-Regular.ttf"),
    oswald: require("../assets/fonts/Oswald-VariableFont_wght.ttf"),
    pathway: require("../assets/fonts/PathwayGothicOne-Regular.ttf"),
    rochester: require("../assets/fonts/Rochester-Regular.ttf"),
    shadowsIntoLight: require("../assets/fonts/ShadowsIntoLight-Regular.ttf"),
  });

  // GET INITIAL APP DATA if JWT exists
  useEffect(() => {
    if (jwt) {
      // local JWT check happened, JWT is still present. Use it to fetch user data,
      // Then after data returns, hide loading indicator / allow the app homepage to be presented
      async function initialData() {
        try {
          await fetchInitialData(jwt as string, dispatch, state);
        } catch (error) {
          console.log("JWT EXISTS, but ERROR FETCHING DATA");
          addToast("error", "There was a problem fetching game data... Please try again later.");
          debugErrors(error);
        } finally {
          setTimeout(() => {
            dispatch({
              type: "TOGGLE LOADING",
              payload: { isLoading: false },
            });
          }, 2000);
        }
      }
      initialData();
    } else if (jwt === false) {
      // local JWT check happened, it's not there so stop loading which will show signin page
      dispatch({ type: "TOGGLE LOADING", payload: { isLoading: false } });
    }
  }, [jwt]);

  /* 
    BEGIN NEW EMAIL VERIFICATION TEST
    !!! INBOUND THIS WORKS, HOWEVER THERES TOO MANY ISSUES WITH THE REDIRECT
    SO DON'T USE FOR NOW
  */

  // const [isReady, setIsReady] = useState(false);
  // const [linking, setLinking] = useState();
  // const ref = useRef();
  // const prefix = Linking.makeUrl("/");

  // const linking = {
  //   prefixes: ["https://herofitgame.com", "herofit://", "exp://"],
  //   config: {
  //     screens: {
  //       Home: "home",
  //     },
  //   },
  // };

  // useEffect(() => {
  //   getInitialState()
  //     .then(state => {
  //       if (state !== undefined) {
  //         setLinking(state);
  //       }

  //       setIsReady(true);
  //     })
  //     .catch(error => console.log("ERROR", error));
  // }, [getInitialState]);

  /* 
    END NEW EMAIL VERIFICATION TEST
  */

  // Sometimes on first startup, user will go to homescreen only to be kicked back to signin
  // perhaps isSignedIn is being set to false somewhere in app?
  //console.log(state.isLoading, !fontsLoaded, state.isSignedIn);

  function determineNavigator(isSignedIn: boolean, initialHomescreenLoad: string) {
    return isSignedIn || initialHomescreenLoad === "Home" ? <MainStackScreen /> : <AuthStackScreen />;
  }
  // const MyTheme = {
  //   ...DefaultTheme,
  //   colors: {
  //     ...DefaultTheme.colors,
  //     background: "#000",
  //   },
  // };
  return (
    <NavigationContainer /* theme={MyTheme} linking={linking}*/>
      <View style={{ height }}>
        {/* If app is loading -> state.isLoading === true
            OR
            If Font have not been loaded  -> fontLoaded === false
            Show loading, otherwise show view
          */}
        {state.isLoading || !fontsLoaded ? <Loading /> : determineNavigator(state.isSignedIn, state.initialHomescreenLoad)}
      </View>
    </NavigationContainer>
  );
};

export default App;
