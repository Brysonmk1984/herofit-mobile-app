import React, { useState } from "react";
import { Box, View, Button, useTheme } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import { ReactChild } from "react-transition-group/node_modules/@types/react";
import ItemTabs from "./ItemTabs";
import { LinearGradient } from "expo-linear-gradient";
import { TabType, TabColors } from "../../../../../common/types";

interface HiddenInventoryProps {
  children: ReactChild | ReactChild[];
  refRBSheet: React.MutableRefObject<{ open: () => any }>;
  bottomDrawerHeight: number;
  activeTab: string;
  setActiveTab: (tab: TabType) => void;
  setBottomDrawerOpen: (isOpen: boolean) => void;
}

const HiddenInventory: React.FC<HiddenInventoryProps> = ({ children, refRBSheet, bottomDrawerHeight, activeTab, setActiveTab, setBottomDrawerOpen }) => {
  const { colors } = useTheme();

  const tabColors: TabColors = {
    Consumables: ["#b91c1c", "red.700"],
    Pets: ["#40E0D0", "#40E0D0"],
    Costumes: ["#7e22ce", "purple.700"],
    Titles: ["#f97316", "orange.500"],
    Codex: ["#9d174d", "pink.800"],
  };
  return (
    <View flex={1} justifyContent="center" alignItems="center" bgColor="#000">
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        height={bottomDrawerHeight}
        openDuration={750}
        onOpen={() => setBottomDrawerOpen(true)}
        onClose={() => setBottomDrawerOpen(false)}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,.1)",
          },
          container: {
            backgroundColor: "black",
          },
          draggableIcon: {
            backgroundColor: "#f1c85b",
          },
        }}
      >
        <ItemTabs activeTab={activeTab} setActiveTab={setActiveTab} tabColors={tabColors} />
        {children}
        <LinearGradient end={{ x: 0, y: 1.2 }} colors={["transparent", tabColors[activeTab][0]]} style={{ height: "100%", width: "100%" }} />
      </RBSheet>
    </View>
  );
};

export default HiddenInventory;
