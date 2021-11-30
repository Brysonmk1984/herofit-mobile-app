import React from "react";
import { StyleSheet } from "react-native";
import { Center, Box, Text } from "native-base";
import herofitTheme from "../styles/herofitTheme";
import Constants from "expo-constants";
interface HeaderProps {
  text: string;
  mt?: number;
  mb?: number;
  color?: string;
  bgColor?: string;
  extraPadding?: boolean;
}

const Header: React.FC<HeaderProps> = ({ text, mb = 0, mt, color, bgColor, extraPadding = Constants.platform.ios ? true : false }) => {
  return (
    <Box flex={0.2} flexBasis={90} mt={extraPadding ? 6 : 0} mb={mb} mt={mt}>
      <Center w="100%" h={100} bgColor={bgColor}>
        <Text color={color} style={Styles.textShadow} fontFamily="heading" fontSize="5xl">
          {text}
        </Text>
      </Center>
    </Box>
  );
};

export default Header;

const { textShadowColor } = herofitTheme.colors.base;
const Styles = StyleSheet.create({
  textShadow: {
    textShadowColor: textShadowColor,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
  },
});
