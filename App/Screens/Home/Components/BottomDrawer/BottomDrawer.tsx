import React, { useRef, useState, useEffect, useContext } from "react";
import { useWindowDimensions } from "react-native";
import { View, Button, Box, useTheme, Text } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import Triangle from "./Triangle";
import StatDisplay from "../../../../Components/StatDisplay";
import { useNavigation } from "@react-navigation/native";
import { PtAndQpMenu } from "./PtAndQpMenu";
import useModal from "../../../../common/hooks/useModal";
import { fetchUpcomingFoeAndRewards } from "../../../../api/battle";
import useGlobalToast from "../../../../common/hooks/useGlobalToast";
import debugErrors from "../../../../common/debugErrors";
import { CharacterName, DefaultHeroProperties, Hero, HeroStatus, HeroWithStats, User } from "../../../../common/types";
import { Battle } from "../../../../common/types-battle";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalStateContext } from "../../../../store";
import HiddenInventory from "./HiddenInventory/HiddenInventory";

interface BottomDrawerProps {
  hero: Hero | (HeroWithStats & DefaultHeroProperties);
  newActivitiesAvailable: boolean;
  latestBattle: Battle | null;
  user: User;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ hero, newActivitiesAvailable, latestBattle, user }) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const bottomDrawerHeight = windowHeight / 2.75;
  const refRBSheet = useRef({ open: () => null });

  const navigation = useNavigation();
  const { openModal } = useModal();
  const { addToast } = useGlobalToast();
  const [battleReportAvailable, setBattleReportAvailable] = useState(false);
  const [battleButtonDisabled, setBattleButtonDisabled] = useState(false);
  const { power, recovery, armor, fire, earth, water, air, aether, photonTokens, qp, goToBattle, id, character, status } = hero;

  async function handleFetchUpcomingBattle() {
    try {
      const { foe, rewards } = await fetchUpcomingFoeAndRewards({ avatarID: id });
      navigation.push("App", { screen: "AwaitingBattle", params: { foe, rewards, character } });
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

  // TESTING
  // useEffect(() => {
  //   setBattleReportAvailable(true);
  // }, []);

  return (
    <Box position="absolute" bottom={0}>
      <LinearGradient colors={["transparent", "#FFFFF0"]} style={{ height: windowHeight * 0.22, width: "100%", position: "absolute", bottom: 0 }} />
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
              {battleReportAvailable ? "Report" : "Battle"}
            </Button>

            {/* <Button borderRadius={0} onPress={handleBattleReport}>
              {battleReportAvailable ? "Report" : "Battle"}
            </Button> */}
          </Box>
        </Box>
      </Box>

      {/* HIDDEN MENU */}
      <HiddenInventory refRBSheet={refRBSheet} bottomDrawerHeight={bottomDrawerHeight}>
        <Text>Test</Text>
        <Text>Test2</Text>
        {/* <Costumes />
        <Pets />
        <Consumables />
        <Titles />
        <Codeci /> */}
      </HiddenInventory>
    </Box>
  );
};

export default BottomDrawer;
