import React, { useRef, useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { View, Button, Box, useTheme } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import Triangle from "./Triangle";
import StatDisplay from "../../../../Components/StatDisplay";
import { useNavigation } from "@react-navigation/native";
import { PtAndQpMenu } from "./PtAndQpMenu";
import useModal from "../../../../common/hooks/useModal";
import { fetchUpcomingFoeAndRewards } from "../../../../api/battle";
import useGlobalToast from "../../../../common/hooks/useGlobalToast";
import debugErrors from "../../../../common/debugErrors";
import { CharacterName, HeroStatus, User } from "../../../../common/types";
import { Battle } from "../../../../common/types-battle";

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
  newActivitiesAvailable: boolean;
  goToBattle: boolean;
  heroId: number;
  heroCharacter: CharacterName;
  user: User;
  latestBattle: Battle | null;
  status: HeroStatus;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ power, recovery, armor, fire, earth, water, air, aether, photonTokens, qp, newActivitiesAvailable, goToBattle, heroId, heroCharacter, user, latestBattle, status }) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const bottomDrawerHeight = windowHeight / 2.75;
  const refRBSheet = useRef({ open: () => null });
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { openModal } = useModal();
  const { addToast } = useGlobalToast();
  const [battleReportAvailable, setBattleReportAvailable] = useState(false);
  const [battleButtonDisabled, setBattleButtonDisabled] = useState(false);

  async function handleFetchUpcomingBattle() {
    try {
      const { foe, rewards } = await fetchUpcomingFoeAndRewards({ avatarID: heroId });
      navigation.push("App", { screen: "AwaitingBattle", params: { foe, rewards, character: heroCharacter } });
    } catch (error) {
      addToast("error", `${error.status}: ${error.message}`);
      return debugErrors(error, user);
    }
  }

  function handleBattleReport() {
    navigation.push("App", { screen: "BattleReport", params: { battleReport: latestBattle } });
  }

  useEffect(() => {
    if (latestBattle && !latestBattle.seenReport) {
      setBattleReportAvailable(true);
      setBattleButtonDisabled(false);
    } else {
      setBattleReportAvailable(false);
      if (status === "Knocked Out") {
        setBattleButtonDisabled(true);
      } else {
        setBattleButtonDisabled(false);
      }
    }
  }, [latestBattle]);

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
            <Button bgColor={newActivitiesAvailable ? "base.highlight" : null} onPress={() => (newActivitiesAvailable ? openModal("ActivityUpgrade") : navigation.push("App", { screen: "ManualActivity" }))} _text={{ fontFamily: "heading", fontSize: 30 }} borderRadius="0px">
              Activity
            </Button>
          </Box>
          <Box w="50%" p={2}>
            <Button bgColor={battleReportAvailable ? "base.highlight" : "base.success"} disabled={battleButtonDisabled} _text={{ fontFamily: "heading", fontSize: 30, color: battleButtonDisabled ? "base.disabledText" : "base.white" }} borderRadius={0} onPress={latestBattle && !latestBattle.seenReport ? handleBattleReport : goToBattle ? handleFetchUpcomingBattle : () => openModal("GoToBattle")}>
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
    </Box>
  );
};

export default BottomDrawer;
