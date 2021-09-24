import { Dimensions, StyleSheet, View as RNView } from "react-native";
import { View, Text, Box, Button, Link, Center, Image } from "native-base";
import React, { useContext } from "react";
import { AuthStackProps } from "../../common/types-navigator";
import { Header, ScreenContainer } from "../../Components/CustomComponents";
import herofitTheme from "../../styles/herofitTheme";
import { GlobalStateContext } from "../../store";

const Splash = ({ navigation, route }: AuthStackProps<"Splash">) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const deviceWidth = Dimensions.get("window").width;

  function handleGetStarted() {
    dispatch({ type: "SET USER STATUS", payload: { userStatus: "new" } });
    navigation.push("AboutGame");
  }

  return (
    <ScreenContainer screenName={route.name}>
      <View justifyContent="center" alignItems="center" h="100%">
        <Box>
          <Image resizeMode="contain" w={deviceWidth} h={190} source={require("../../../assets/images/misc/herofit-logo.webp")} alt="HeroFit" />
        </Box>

        <View>
          <Text color="base.primary" fontFamily="heading" fontSize={22}>
            The Fitness Tracking Game
          </Text>
        </View>
        <View w={200} mt={70} mx={50}>
          <Button shadow={9} border={1} borderColor="base.brand" onPress={handleGetStarted}>
            GET STARTED
          </Button>

          <Center>
            <Text fontSize="xl" color="base.white" mt={3} mb={3}>
              - or -
            </Text>
            <Link _text={{ fontSize: "2xl" }} onPress={() => navigation.push("SignIn")} mt={1}>
              SIGN IN
            </Link>
          </Center>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Splash;
const { colors, shadow } = herofitTheme;
const { textShadowColor, white } = colors.base;
const Styles = StyleSheet.create({
  textShadow: {
    textShadowColor: textShadowColor,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
  },
});
