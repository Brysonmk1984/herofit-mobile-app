import React, { useRef } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import { View, Text, Button, Box, useTheme } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import Triangle from "./Triangle";
import StatDisplay from "../../../../Components/StatDisplay";

interface BottomDrawerProps {
  power: number;
  recovery: number;
  armor: number;
  fire: number;
  earth: number;
  water: number;
  air: number;
  aether: number;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ power, recovery, armor, fire, earth, water, air, aether }) => {
  const windowHeight = useWindowDimensions().height;
  const bottomDrawerHeight = windowHeight / 2.75;
  const refRBSheet = useRef({ open: () => null });
  const { colors } = useTheme();

  return (
    <Box position="absolute" bottom={0}>
      <Box>
        <Box alignItems="center">
          <Triangle action={() => refRBSheet.current.open()} />
        </Box>
        <Box display="flex" flexDirection="row" backgroundColor="base.primary">
          <Box w="50%" p={2} borderRightWidth={1} borderRightColor="primary.800">
            <Button _text={{ fontFamily: "heading", fontSize: 30 }} borderRadius="0px">
              Quantum
            </Button>
          </Box>
          <Box w="50%" p={2}>
            <Button _text={{ fontFamily: "heading", fontSize: 30 }} borderRadius={0}>
              Battle
            </Button>
          </Box>
        </Box>
      </Box>
      <View style={styles.bottomDrawer}>
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
            },
            draggableIcon: {
              backgroundColor: "#f1c85b",
            },
          }}
        >
          <Box flexDirection="row">
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Power" value={power} reversedText size="sm" />
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Recovery" value={recovery} reversedText size="sm" />
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Armor" value={armor} reversedText size="sm" />
            {aether > 0 ? <StatDisplay flex={1} stat="Aether" value={aether} reversedText size="sm" /> : null}
          </Box>
          <Box display="flex" flexDirection="row">
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Fire" value={fire} reversedText size="sm" />
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Earth" value={earth} reversedText size="sm" />
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Water" value={water} reversedText size="sm" />
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Air" value={air} reversedText size="sm" />
          </Box>
          <Box flexDirection="row">
            <Button m={1} flex={1}>
              Inventory
            </Button>
            <Button m={1} flex={1}>
              Profile
            </Button>
            <Button m={1} flex={1}>
              Campaign
            </Button>
          </Box>
        </RBSheet>
      </View>
    </Box>
  );
};

export default BottomDrawer;

const styles = StyleSheet.create({
  bottomDrawer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
