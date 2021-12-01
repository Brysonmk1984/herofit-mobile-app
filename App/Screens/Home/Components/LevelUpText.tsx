import React, { useEffect, useRef } from "react";
import { Center, Text } from "native-base";
import { Animated, Easing, ImageBackground, StyleSheet } from "react-native";
import herofitTheme from "../../../styles/herofitTheme";

interface LevelUpTextProps {
  deviceHeight: number;
}

const LevelUpText: React.FC<LevelUpTextProps> = ({ deviceHeight }) => {
  const slideAnim = useRef(new Animated.Value(deviceHeight)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.quad,
    }).start(fadeOut);
  };

  const fadeOut = () => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.quad,
    }).start();
  };

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: -deviceHeight,
      duration: 3000,
      useNativeDriver: true,
      easing: Easing.quad,
    }).start();
  };

  useEffect(() => {
    slideIn();
    fadeIn();
  }, []);

  return (
    <Animated.View position="absolute" width="100%" height={deviceHeight * 0.4} left={0} bottom={0} zIndex={1} style={{ transform: [{ translateY: slideAnim }], opacity: opacityAnim }}>
      <ImageBackground style={{ width: "100%", height: "100%" }} source={require("../../../../assets/images/layout/battle-gradient.webp")} resizeMode="stretch">
        <Center h="100%" w="100%">
          <Text fontSize="7xl" fontFamily="heading" color="base.qp" style={Styles.textShadow}>
            LEVEL UP!
          </Text>
        </Center>
      </ImageBackground>
    </Animated.View>
  );
};

export default LevelUpText;

const { textShadowColor } = herofitTheme.colors.base;
const Styles = StyleSheet.create({
  textShadow: {
    textShadowColor: textShadowColor,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
  },
});
