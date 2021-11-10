import React from "react";
import { VStack, Link, Text, Pressable, Button } from "native-base";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../../common/types-navigator";
import * as WebBrowser from "expo-web-browser";
import useSignOut from "../../../common/hooks/useSignout";

interface SidebarMenuProps {
  navigation: StackNavigationProp<MainStackParamList, "Home">;
  setDrawerIsOpen: (prev: boolean) => boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ navigation, setDrawerIsOpen }) => {
  const { signOut } = useSignOut();

  function handleNavigation(cb: () => void) {
    setDrawerIsOpen((prev: boolean) => !prev);
    cb();
  }
  return (
    <VStack bgColor="base.primary" space={1} height="100%">
      <Button variant="ghost" pl={3} mt={5} onPress={() => handleNavigation(() => navigation.push("Adversaries"))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
        Adversaries
      </Button>
      <Button variant="ghost" pl={3} onPress={() => handleNavigation(() => navigation.push("Feedback"))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
        Feedback
      </Button>
      <Button variant="ghost" pl={3} onPress={() => handleNavigation(() => navigation.push("Settings"))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
        Settings
      </Button>
      <Button variant="ghost" pl={3} onPress={() => handleNavigation(() => WebBrowser.openBrowserAsync(`https://herofit.io/items/`))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
        Item Wiki
      </Button>
      <Button variant="ghost" pl={3} onPress={() => handleNavigation(() => WebBrowser.openBrowserAsync(`https://herofit.io/ranking/`))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
        Ranking
      </Button>
      <Button variant="ghost" pl={3} onPress={() => handleNavigation(() => signOut())} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
        Sign Out
      </Button>
    </VStack>
  );
};

export default SidebarMenu;
