import React from "react";
import { Box, Pressable, Text } from "native-base";

interface TabProps {
  name: string;
  bgColor: string;
  active: boolean;
  action: () => void;
  color?: string;
}

const Tab: React.FC<TabProps> = ({ name, bgColor, active, action, color = "primary.400" }) => {
  return (
    <Pressable onPress={action}>
      <Box bgColor={active ? "base.highlight" : bgColor} borderRadius={3} mx={2} px={2} py={1}>
        <Text px={name.length < 7 ? 2 : 0} textDecoration={active ? null : "underline"} fontFamily="heading" color={active ? "primary.900" : color}>
          {name}
        </Text>
      </Box>
    </Pressable>
  );
};

export default Tab;
