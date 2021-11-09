import React from "react";
import { Box, Icon, Pressable } from "native-base";
import { AntDesign } from "@expo/vector-icons";

interface DrawerIndicatorProps {
  setDrawerIsOpen: (prev: boolean) => void;
}

const DrawerIndicator: React.FC<DrawerIndicatorProps> = ({ setDrawerIsOpen }) => {
  return (
    <Pressable onPress={() => setDrawerIsOpen(prev => !prev)} position="absolute" right={0} top={8} zIndex={10}>
      <Box borderLeftRadius={"8px"} bgColor="base.highlight" px={1} py={2}>
        <Icon as={AntDesign} name="menufold" size={7} color="base.white" />
      </Box>
    </Pressable>
  );
};
export default DrawerIndicator;
