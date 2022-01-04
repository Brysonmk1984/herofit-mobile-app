import React from "react";
import { VStack, Text, Button, Image } from "native-base";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../../common/types-navigator";
import * as WebBrowser from "expo-web-browser";
import useSignOut from "../../../common/hooks/useSignout";

interface SidebarMenuProps {
  navigation: StackNavigationProp<MainStackParamList, "Home">;
  setSideDrawerOpen: (prev: boolean) => boolean;
  heroName: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ navigation, setSideDrawerOpen, heroName }) => {
  const { signOut } = useSignOut();

  function handleNavigation(cb: () => void) {
    setSideDrawerOpen((prev: boolean) => !prev);
    cb();
  }
  return (
    <VStack bgColor="base.primary" height="100%" justifyContent="space-between" borderLeftWidth="1" borderLeftColor="base.brand" pb={5}>
      <VStack space={1} pt={5}>
        <Button variant="ghost" borderColor="#40403e" borderBottomWidth="1" borderTopWidth="1" pl={3} mt={5} onPress={() => handleNavigation(() => navigation.push("Adversaries"))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
          Adversaries
        </Button>
        <Button variant="ghost" borderBottomColor="#40403e" borderBottomWidth="1" pl={3} onPress={() => handleNavigation(() => navigation.push("Feedback"))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
          Feedback
        </Button>
        <Button variant="ghost" borderBottomColor="#40403e" borderBottomWidth="1" pl={3} onPress={() => handleNavigation(() => navigation.push("Settings"))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
          Settings
        </Button>
        <Button variant="ghost" borderBottomColor="#40403e" borderBottomWidth="1" pl={3} onPress={() => handleNavigation(() => WebBrowser.openBrowserAsync(`https://herofit.io/items/`))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
          Item Wiki
        </Button>
        <Button variant="ghost" borderBottomColor="#40403e" borderBottomWidth="1" pl={3} onPress={() => handleNavigation(() => WebBrowser.openBrowserAsync(`https://herofit.io/ranking/`))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
          Ranking
        </Button>
        <Button variant="ghost" borderBottomColor="#40403e" borderBottomWidth="1" pl={3} onPress={() => handleNavigation(() => WebBrowser.openBrowserAsync(`https://herofit.io/users/${encodeURI(heroName)}`))} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
          Profile
        </Button>
        <Button variant="ghost" borderBottomColor="#40403e" borderBottomWidth="1" pl={3} onPress={() => handleNavigation(() => signOut())} fontSize="2xl" fontFamily="heading" _text={{ color: "primary.200" }} _pressed={{ _text: { color: "base.brand" }, bgColor: "base.primary" }}>
          Sign Out
        </Button>
      </VStack>
      <VStack flexBasis={100} alignItems="center" mb={5}>
        <Image size="80%" source={require("../../../../assets/images/misc/herofit-logo.webp")} resizeMode="contain" alt="HeroFit Logo" />
        <Text mt={-5} color="base.brand">
          ©2020 - 2022 HeroFit
        </Text>
      </VStack>
    </VStack>
  );
};

export default SidebarMenu;
