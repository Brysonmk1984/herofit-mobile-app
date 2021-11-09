import React from "react";
import { VStack, Link, Text } from "native-base";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../../common/types-navigator";
import * as WebBrowser from "expo-web-browser";
import useSignOut from "../../../common/hooks/useSignout";

interface SidebarMenuProps {
  navigation: StackNavigationProp<MainStackParamList, "Home">;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ navigation }) => {
  const { signOut } = useSignOut();
  return (
    <VStack space={2}>
      <Link onPress={() => navigation.push("Adversaries")}>Adversaries</Link>
      <Link onPress={() => navigation.push("Feedback")}>Feedback</Link>
      <Link onPress={() => navigation.push("Settings")}>Settings</Link>
      <Link onPress={() => WebBrowser.openBrowserAsync(`https://herofit.io/items/`)}>Item Wiki</Link>
      <Link onPress={() => WebBrowser.openBrowserAsync(`https://herofit.io/ranking/`)}>Ranking</Link>
      <Link onPress={() => signOut()}>Sign Out</Link>
    </VStack>
  );
};

export default SidebarMenu;
