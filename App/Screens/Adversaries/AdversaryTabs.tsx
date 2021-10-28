import React, { useState } from "react";
import { View, Box, Text, FlatList, HStack, Pressable } from "native-base";
import Tab from "./Tab";
import { TabType, TabColors } from "../../../../../common/types";
import { FoeClass } from "../../common/types";

interface ItemTabsProps {
  activeTab: string;
  setActiveTab: (tab: TabType) => void;
}

const AdversaryTabs: React.FC<ItemTabsProps> = ({ activeTab, setActiveTab }) => {
  function changeActiveTab(tab: TabType) {
    setActiveTab(tab);
  }

  return (
    <HStack>
      <Pressable flex={1} onPress={() => changeActiveTab("Spirits")}>
        <Box bgColor={"base.white"} px={4} py={3}>
          <Text textAlign="center" fontFamily="heading" color={activeTab === "Spirits" ? "base.highlight" : "base.black"}>
            Spirits
          </Text>
        </Box>
      </Pressable>
      <Pressable flex={1} onPress={() => changeActiveTab("Elementals")}>
        <Box bgColor={"base.fire"} px={4} py={3}>
          <Text textAlign="center" fontFamily="heading" color={activeTab === "Elementals" ? "base.highlight" : "base.black"}>
            Elementals
          </Text>
        </Box>
      </Pressable>
      <Pressable flex={1} onPress={() => changeActiveTab("Titans")}>
        <Box bgColor={"base.black"} px={4} py={3}>
          <Text textAlign="center" fontFamily="heading" color={activeTab === "Titans" ? "base.highlight" : "base.white"}>
            Titans
          </Text>
        </Box>
      </Pressable>
    </HStack>
  );
};
export default AdversaryTabs;
