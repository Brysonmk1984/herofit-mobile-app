import React from "react";
import { Box, Pressable, Text } from "native-base";

interface TabProps {
  name: string;
  bgColor: string;
  active: boolean;
  action: () => void;
  color?: string;
}

const Tab: React.FC<TabProps> = ({ name, bgColor, active, action, color = "primary.600" }) => {
  return (
    <Pressable onPress={action}>
      <Box bgColor={bgColor} borderRadius={3} mx={2} px={2} py={1}>
        <Text px={name.length < 7 ? 2 : 0} textDecoration={active ? null : "underline"} textDecorationColor={color} fontFamily="heading" color={active ? "base.white" : color}>
          {name}
        </Text>
      </Box>
    </Pressable>
  );
};

export default Tab;
