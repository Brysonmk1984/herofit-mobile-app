import React, { useContext, useEffect } from "react";
import { LogBox, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { GlobalStateContext } from "./store";
import RootStackScreen from "./Navigator";
import { Loading } from "./Screens";
import debugErrors from "./common/debugErrors";
import fetchInitialData from "./common/fetchInitialData";
import useJwt from "./common/hooks/useJwt";
import { getHeroAlias } from "./common/helperFunctions";
import { View } from "native-base";
import useGlobalToast from "./common/hooks/useGlobalToast";
//LogBox.ignoreLogs(["Reanimated 2", "Remote debugger", "VirtualizedLists should never be nested", 'Expected style "lineHeight: 24" to contain units', 'Expected style "lineHeight: 30" to contain units', 'Expected style "lineHeight: 40" to contain units', 'Expected style "lineHeight: 50" to contain units', 'Expected style "lineHeight: 85" to contain units', 'Expected style "lineHeight: 120" to contain units', "Please pass alt prop to Image component", "Non-serializable values were found in the navigation state"]);
LogBox.ignoreAllLogs(true);

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
    // 'pragatiNarrow-bold': require('../assets/fonts/PragatiNarrow-Bold.ttf'),
    // 'pragatiNarrow': require('../assets/fonts/PragatiNarrow-Regular.ttf'),
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

  return (
    <NavigationContainer>
      <View style={{ height }}>
        {/* If app is loading -> state.isLoading === true
          OR
          If Font have not been loaded  -> fontLoaded === false
          Show loading, otherwise show view
        */}
        {state.isLoading || !fontsLoaded ? <Loading /> : <RootStackScreen isSignedIn={state.isSignedIn} />}
      </View>
    </NavigationContainer>
  );
};

export default App;
