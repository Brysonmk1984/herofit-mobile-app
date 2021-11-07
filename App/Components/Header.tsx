import React from "react";
import { StyleSheet } from "react-native";
import { Center, Heading, Text } from "native-base";
import herofitTheme from "../styles/herofitTheme";

interface HeaderProps {
  text: string;
  mb?: number;
  color?: string;
}

const Header: React.FC<HeaderProps> = ({ text, mb = 0, color }) => {
  return (
    <Center flex={0.2} flexBasis={90} mt={3} mb={mb} bgColor="base.lightTransparent">
      <Text color={color} style={Styles.textShadow} fontFamily="heading" fontSize="5xl">
        {text}
      </Text>
    </Center>
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
