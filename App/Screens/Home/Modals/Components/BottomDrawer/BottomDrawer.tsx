import React, { useRef } from "react";
import { useWindowDimensions } from "react-native";
import { View, Button, Box, useTheme } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import Triangle from "../Triangle";
import StatDisplay from "../../../../../Components/StatDisplay";
import { useNavigation } from "@react-navigation/native";
import { PtAndQpMenu } from "./PtAndQpMenu";
import { Activity } from "../../../../../common/types";
import { StravaActivityUpgrade } from "../../StravaActivityUpgrade";
import useModal from "../../../../../common/hooks/useModal";

interface BottomDrawerProps {
  power: number;
  recovery: number;
  armor: number;
  fire: number;
  earth: number;
  water: number;
  air: number;
  aether: number;
  photonTokens: number;
  qp: number;
  newActivities: Activity[];
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ power, recovery, armor, fire, earth, water, air, aether, photonTokens, qp, newActivities }) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const bottomDrawerHeight = windowHeight / 2.75;
  const refRBSheet = useRef({ open: () => null });
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { openModal } = useModal();

  return (
    <Box position="absolute" bottom={0}>
      {/* PT & QP */}
      <PtAndQpMenu photonTokens={photonTokens} qp={qp} windowWidth={windowWidth} />
      {/* ACTIVITY & BATTLE */}
      <Box>
        <Box alignItems="center">
          <Triangle action={() => refRBSheet.current.open()} />
        </Box>

        <Box borderTopColor="primary.800" borderTopWidth={1} display="flex" flexDirection="row" backgroundColor="base.primary">
          <Box w="50%" p={2} borderRightWidth={1} borderRightColor="primary.800">
            <Button bgColor={newActivities.length ? "base.highlight" : null} onPress={() => (newActivities.length ? openModal("StravaActivityUpgrade") : navigation.push("App", { screen: "ManualActivity" }))} _text={{ fontFamily: "heading", fontSize: 30 }} borderRadius="0px">
              Activity
            </Button>
          </Box>
          <Box w="50%" p={2}>
            <Button _text={{ fontFamily: "heading", fontSize: 30 }} borderRadius={0}>
              Battle
            </Button>
          </Box>
        </Box>
      </Box>
      {/* HIDDEN MENU */}
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
      {/* Modals */}
      <StravaActivityUpgrade id="StravaActivityUpgrade" activities={newActivities} />
    </Box>
  );
};

export default BottomDrawer;
