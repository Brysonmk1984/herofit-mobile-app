import React from "react";
import { Box, View, Button, useTheme } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import { ReactChild } from "react-transition-group/node_modules/@types/react";
import ItemTabs from "./ItemTabs";

interface HiddenInventoryProps {
  children: ReactChild | ReactChild[];
  refRBSheet: React.MutableRefObject<{ open: () => any }>;
  bottomDrawerHeight: number;
}

const HiddenInventory: React.FC<HiddenInventoryProps> = ({ children, refRBSheet, bottomDrawerHeight }) => {
  const { colors } = useTheme();
  return (
    <View flex={1} justifyContent="center" alignItems="center" backgroundColor="#000">
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={bottomDrawerHeight}
        openDuration={750}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          container: {
            backgroundColor: colors.base.primary,
            overflow: "visible",
          },
          draggableIcon: {
            backgroundColor: "#f1c85b",
          },
        }}
      >
        <ItemTabs />
        {children}
      </RBSheet>
    </View>
  );
};

export default HiddenInventory;
