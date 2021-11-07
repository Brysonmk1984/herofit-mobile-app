import React from "react";
import { HStack, Box, Text } from "native-base";
import Icon from "./Icon";

interface PaneSupportTextProps {
  children: string;
  iconName: string;
  text: string;
  iconColor?: string;
  textColor?: string;
}

export const PaneSupportText: React.FC<PaneSupportTextProps> = ({ children, iconName, text, iconColor = "base.primary", textColor = "base.primary" }) => {
  return (
    <Box alignItems="center">
      <HStack px={2} alignItems="center">
        <Box flex={0.2}>
          <Icon iconName={iconName} size={7} color={iconColor} />
        </Box>
        <Box flex={1} flexShrink={1}>
          <Text fontSize="lg" color={textColor}>
            {text}
          </Text>
        </Box>
      </HStack>
      <Text textAlign="center" p={2} color="primary.700">
        {children}
      </Text>
    </Box>
  );
};
