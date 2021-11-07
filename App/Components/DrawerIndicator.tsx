import React from "react";
import { Box, Icon, Pressable } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface DrawerIndicatorProps {}

const DrawerIndicator: React.FC<DrawerIndicatorProps> = () => {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.toggleDrawer()} position="absolute" right={0} top={8} zIndex={10}>
      <Box borderLeftRadius={"8px"} bgColor="base.highlight" px={1} py={2}>
        <Icon as={AntDesign} name="menufold" size={7} color="base.white" />
      </Box>
    </Pressable>
  );
};
export default DrawerIndicator;
