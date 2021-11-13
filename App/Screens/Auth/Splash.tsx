import { Animated, Dimensions, ImageBackground, StyleSheet, View as RNView } from "react-native";
import { View, Text, Center, Button, Link, Image } from "native-base";
import React, { useContext, useState } from "react";
import { AuthStackProps } from "../../common/types-navigator";
import { Header, ScreenContainer } from "../../Components/CustomComponents";
import herofitTheme from "../../styles/herofitTheme";
import { GlobalStateContext } from "../../store";
import * as Linking from "expo-linking";

const Splash = ({ navigation, route }: AuthStackProps<"Splash">) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [fadeAnim] = useState(new Animated.Value(0));
  const deviceWidth = Dimensions.get("window").width;
  function handleGetStarted() {
    dispatch({ type: "SET USER STATUS", payload: { userStatus: "new" } });
    navigation.push("AboutGame");
  }

  // If a user returns to app, but at a later time and the app was closed, need to get initial URL and redirect as needed
  Linking.getInitialURL().then(url => {
    const verifyPassword = Linking.parse(url).queryParams?.verifyPassword;
    if (verifyPassword) {
      navigation.push("ForgotPassword", { verifyPassword });
    }
  });
  // Shouldn't normally happen, but if a user already had app open and is on splash screen after redirect from email and website: capture URL and pass verifyPassword url param as screen parameter to forgot password
  Linking.addEventListener("url", data => {
    const verifyPassword = Linking.parse(data.url)?.queryParams.verifyPassword;
    if (verifyPassword) {
      navigation.push("ForgotPassword", { verifyPassword });
    }
  });

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [fadeAnim]);

  return (
    <ScreenContainer screenName={route.name}>
      <View justifyContent="space-between" alignItems="center" h="100%">
        <Center mt={85}>
          <Image resizeMode="contain" w={deviceWidth} h={190} source={require("../../../assets/images/misc/herofit-logo.webp")} alt="HeroFit" />
          <Text color="base.primary" fontFamily="heading" fontSize={22}>
            The Fitness Tracking Game
          </Text>
        </Center>
        <View w="100%" h={300}>
          <Animated.View
            style={{
              opacity: fadeAnim,
            }}
          >
            <ImageBackground style={{ width: "100%" }} source={require("../../../assets/images/backgrounds/splash_bottom.webp")} resizeMode="cover">
              <Center h="100%" justifyContent="flex-end" pb={Platform.OS === "android" ? 10 : 5}>
                <Button px={16} _text={{ fontSize: "3xl" }} shadow={9} borderColor="base.brand" onPress={handleGetStarted}>
                  GET STARTED
                </Button>
                <Text fontSize="xl" color="primary.500" mt={2}>
                  - or -
                </Text>
                <Link _text={{ fontSize: "2xl" }} onPress={() => navigation.push("SignIn")} mt={1}>
                  SIGN IN
                </Link>
              </Center>
            </ImageBackground>
          </Animated.View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Splash;
