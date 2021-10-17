import React, { useState } from "react";
import { View, Box, Text, HStack, Pressable } from "native-base";
import Tab from "./Tab";

interface ItemTabsProps {}

const ItemTabs: React.FC<ItemTabsProps> = ({}) => {
  const [tabGroup, setTabGroup] = useState(0);
  const [activeTab, setActiveTab] = useState("Consumables");

  function toggleTabGroups() {
    setTabGroup(tg => (tg === 0 ? 1 : 0));
  }

  function changeActiveTab(tab: string) {
    setActiveTab(tab);
  }

  return (
    <View>
      <HStack justifyContent="space-between">
        {tabGroup === 0 ? (
          // Tab Group 0
          <HStack>
            <Tab name="Consumables" bgColor="red.700" active={activeTab === "Consumables"} action={() => changeActiveTab("Consumables")} />
            <Tab name="Pets" bgColor="green.700" active={activeTab === "Pets"} action={() => changeActiveTab("Pets")} />
            <Tab name="Costumes" bgColor="purple.700" active={activeTab === "Costumes"} action={() => changeActiveTab("Costumes")} />
          </HStack>
        ) : (
          // Tab Group 1
          <HStack>
            <Tab name="Titles" bgColor="orange.700" active={activeTab === "Titles"} action={() => changeActiveTab("Titles")} />
            <Tab name="Codex" bgColor="pink.800" active={activeTab === "Codex"} action={() => changeActiveTab("Codex")} />
          </HStack>
        )}

        {/* More Tab - Always visible */}
        <Tab name="More" bgColor="primary.200" active={false} action={toggleTabGroups} color={"primary.800"} />
      </HStack>
    </View>
  );
};
export default ItemTabs;
