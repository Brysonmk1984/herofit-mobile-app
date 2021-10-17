import React, { useState } from "react";
import { View, Box, Text, HStack, Pressable } from "native-base";
import Tab from "./Tab";
import { ItemType, TabColors } from "../../../../../common/types";

interface ItemTabsProps {
  activeTab: string;
  setActiveTab: (tab: ItemType) => void;
  tabColors: TabColors;
}

const ItemTabs: React.FC<ItemTabsProps> = ({ activeTab, setActiveTab, tabColors }) => {
  const [tabGroup, setTabGroup] = useState(0);

  function toggleTabGroups() {
    setTabGroup(tg => (tg === 0 ? 1 : 0));
  }

  function changeActiveTab(tab: ItemType) {
    setActiveTab(tab);
  }

  return (
    <View>
      <HStack justifyContent="space-between">
        {tabGroup === 0 ? (
          // Tab Group 0
          <HStack>
            <Tab name="Consumables" bgColor={tabColors.Consumables[1]} active={activeTab === "Consumables"} action={() => changeActiveTab("Consumables")} />
            <Tab name="Pets" bgColor={tabColors.Pets[1]} active={activeTab === "Pets"} action={() => changeActiveTab("Pets")} />
            <Tab name="Costumes" bgColor={tabColors.Costumes[1]} active={activeTab === "Costumes"} action={() => changeActiveTab("Costumes")} />
          </HStack>
        ) : (
          // Tab Group 1
          <HStack>
            <Tab name="Titles" bgColor={tabColors.Titles[1]} active={activeTab === "Titles"} action={() => changeActiveTab("Titles")} />
            <Tab name="Codex" bgColor={tabColors.Codex[1]} active={activeTab === "Codex"} action={() => changeActiveTab("Codex")} />
          </HStack>
        )}

        {/* More Tab - Always visible */}
        <Tab name="More" bgColor="primary.200" active={false} action={toggleTabGroups} color={"primary.800"} />
      </HStack>
    </View>
  );
};
export default ItemTabs;
