import React, { useContext, useEffect } from "react";
import { LogBox, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { GlobalStateContext } from "./store";
import RootStackScreen from "./Navigator";
import { Loading } from "./Screens";
import Alerts from "./Alerts";
import debugErrors from "./common/debugErrors";
import fetchInitialData from "./common/fetchInitialData";
import useJwt from "./common/hooks/useJwt";
import { getHeroAlias } from "./common/helperFunctions";
import { View } from "native-base";
LogBox.ignoreLogs(["Reanimated 2", "Remote debugger", "VirtualizedLists should never be nested"]);

const height = Dimensions.get("window").height;
const App: React.FC = () => {
  const { state, dispatch } = useContext(GlobalStateContext);

  const [jwt] = useJwt();
  const [fontsLoaded] = useFonts({
    icomoon: require("../assets/fonts/icomoon.ttf"),
    "bebas-neue": require("../assets/fonts/BebasNeue-Regular.ttf"),
    oswald: require("../assets/fonts/Oswald-VariableFont_wght.ttf"),
    pathway: require("../assets/fonts/PathwayGothicOne-Regular.ttf"),
    // 'pragatiNarrow-bold': require('../assets/fonts/PragatiNarrow-Bold.ttf'),
    // 'pragatiNarrow': require('../assets/fonts/PragatiNarrow-Regular.ttf'),
    rochester: require("../assets/fonts/Rochester-Regular.ttf"),
  });

  // GET INITIAL APP DATA if JWT exists
  useEffect(() => {
    if (jwt) {
      // local JWT check happened, JWT is definitely still present. Use it to fetch user data,
      // Then after data returns, hide loading indicator / allow the app homepage to be presented
      async function initialData() {
        try {
          await fetchInitialData(jwt as string, dispatch, state);
        } catch (error) {
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

  console.log(state.isLoading, fontsLoaded);

  return (
    <NavigationContainer>
      <View style={{ height }}>
        {/* If app is loading -> state.isLoading === true
          OR
          If Font have not been loaded  -> fontLoaded === false
          Show loading, otherwise show view
        */}
        {state.isLoading || !fontsLoaded ? <Loading /> : <RootStackScreen isSignedIn={state.isSignedIn} />}
        {state.alerts.length ? <Alerts alerts={state.alerts} dispatch={dispatch} /> : null}
      </View>
    </NavigationContainer>
  );
};

export default App;
