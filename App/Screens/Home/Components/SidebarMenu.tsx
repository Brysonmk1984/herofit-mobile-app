import React from "react";
import { VStack, Link, Text } from "native-base";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../../common/types-navigator";
import * as WebBrowser from "expo-web-browser";
import useSignOut from "../../../common/hooks/useSignout";

interface SidebarMenuProps {
  navigation: StackNavigationProp<MainStackParamList, "Home">;
  setDrawerIsOpen: (prev: boolean) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ navigation, setDrawerIsOpen }) => {
  const { signOut } = useSignOut();

  function handleNavigation(cb) {
    setDrawerIsOpen(prev => !prev);
    cb();
  }
  return (
    <VStack space={2}>
      <Link onPress={() => handleNavigation(() => navigation.push("Adversaries"))}>Adversaries</Link>
      <Link onPress={() => handleNavigation(() => navigation.push("Feedback"))}>Feedback</Link>
      <Link onPress={() => handleNavigation(() => navigation.push("Settings"))}>Settings</Link>
      <Link onPress={() => handleNavigation(() => WebBrowser.openBrowserAsync(`https://herofit.io/items/`))}>Item Wiki</Link>
      <Link onPress={() => handleNavigation(() => WebBrowser.openBrowserAsync(`https://herofit.io/ranking/`))}>Ranking</Link>
      <Link onPress={() => handleNavigation(() => signOut())}>Sign Out</Link>
    </VStack>
  );
};

export default SidebarMenu;
