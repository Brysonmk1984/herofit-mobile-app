import React from "react";
import { StyleSheet } from "react-native";
import { Center, Box, Text } from "native-base";
import herofitTheme from "../styles/herofitTheme";

interface HeaderProps {
  text: string;
  mb?: number;
  color?: string;
  bgColor?: string;
}

const Header: React.FC<HeaderProps> = ({ text, mb = 0, color, bgColor }) => {
  return (
    <Box flex={0.2} flexBasis={90} mt={2} mb={mb}>
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
