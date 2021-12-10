import { Animated, ImageBackground } from "react-native";
import { View, Text, Center, Button, Link, Image } from "native-base";
import React, { useEffect, useContext, useMemo, useState } from "react";
import { AuthStackProps } from "../../common/types-navigator";
import { ScreenContainer } from "../../Components/CustomComponents";
import { GlobalStateContext } from "../../store";
import useAspectRatio from "../../common/hooks/useAspectRatio";

const Splash = ({ navigation, route }: AuthStackProps<"Splash">) => {
  const { dispatch } = useContext(GlobalStateContext);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { deviceWidth, deviceHeight } = useMemo(() => useAspectRatio(), []);

  function handleGetStarted() {
    dispatch({ type: "SET USER STATUS", payload: { userStatus: "new" } });
    navigation.push("AboutGame");
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [fadeAnim]);

  useEffect(() => {
    dispatch({ type: "RESET DEFAULTS" });
  }, []);

  return (
    <ScreenContainer screenName={route.name} safeAreaContainer={false}>
      <View justifyContent="space-between" alignItems="center" h="100%">
        <Center mt={85}>
          <Image resizeMode="contain" w={deviceWidth} h={190} source={require("../../../assets/images/misc/herofit-logo.webp")} alt="HeroFit" />
          <Text color="base.primary" fontFamily="heading" fontSize={22}>
            The Fitness Tracking Game
          </Text>
        </Center>
        <View w="100%" h={deviceHeight * 0.44}>
          <Animated.View
            style={{
              opacity: fadeAnim,
            }}
          >
            <ImageBackground style={{ width: "100%" }} source={require("../../../assets/images/backgrounds/splash_bottom.webp")} resizeMode="cover">
              <Center h="100%" justifyContent="flex-end" pb={10}>
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
