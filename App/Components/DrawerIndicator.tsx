import React from "react";
import { Box, Icon, Pressable } from "native-base";
import { AntDesign } from "@expo/vector-icons";

interface DrawerIndicatorProps {
  action: () => void;
}

export const DrawerIndicator: React.FC<DrawerIndicatorProps> = ({ action }) => {
  return (
    <Pressable onPress={action} position="absolute" right={0} top={3}>
      <Box borderLeftRadius={"8px"} bgColor="base.highlight" p={2}>
        <Icon as={AntDesign} name="menufold" size={8} color="base.white" />
      </Box>
    </Pressable>
  );
};
