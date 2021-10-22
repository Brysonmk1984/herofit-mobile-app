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
import { CharacterName, DefaultHeroProperties, Hero, HeroStatus, HeroWithStats, ItemType, User } from "../../../../common/types";
import { Battle } from "../../../../common/types-battle";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalStateContext } from "../../../../store";
import HiddenInventory from "./HiddenInventory/HiddenInventory";
import useInventory from "../../../../common/hooks/useInventory";
import { isExistingHero } from "../../../../common/typeGuards";
import ItemCarousel from "./HiddenInventory/ItemCarousel";
import ItemDetail from "./HiddenInventory/Modals/ItemDetail";

interface BottomDrawerProps {
  hero: Hero | (HeroWithStats & DefaultHeroProperties);
  newActivitiesAvailable: boolean;
  latestBattle: Battle | null;
  user: User;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ hero, newActivitiesAvailable, latestBattle, user }) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const bottomDrawerHeight = windowHeight / 2.25;
  const refRBSheet = useRef({ open: () => null });

  const navigation = useNavigation();
  const { openModal } = useModal();
  const { addToast } = useGlobalToast();
  let heroId: number | null = null;
  if (isExistingHero(hero)) {
    heroId = hero.id;
  }
  const { consumables, pets, costumes, titles, codex, equippedPet, equippedCostume, equippedTitle } = useInventory();
  const [battleReportAvailable, setBattleReportAvailable] = useState(false);
  const [battleButtonDisabled, setBattleButtonDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState<ItemType>("Consumables");
  const [pressedItem, setPressedItem] = useState(null);
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

  console.log("!!!!", pets);

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

        <Box borderTopColor="primary.800" borderTopWidth={1} display="flex" flexDirection="row" bgColor="base.primary">
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
      {pressedItem && <ItemDetail id="ItemDetail" item={pressedItem} character={character} />}
      {/* HIDDEN MENU */}
      <HiddenInventory refRBSheet={refRBSheet} bottomDrawerHeight={bottomDrawerHeight} activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === "Consumables" && <ItemCarousel type="consumables" data={consumables} setPressedItem={setPressedItem} refRBSheet={refRBSheet} />}
        {activeTab === "Pets" && <ItemCarousel type="pets" data={pets} equipped={equippedPet} setPressedItem={setPressedItem} refRBSheet={refRBSheet} />}
        {activeTab === "Costumes" && <ItemCarousel type="costumes" data={costumes} equipped={equippedCostume} character={hero.character} setPressedItem={setPressedItem} refRBSheet={refRBSheet} />}
        {activeTab === "Titles" && <ItemCarousel type="titles" data={titles} equipped={equippedTitle} setPressedItem={setPressedItem} refRBSheet={refRBSheet} />}
        {activeTab === "Codex" && <ItemCarousel type="codex" data={codex} setPressedItem={setPressedItem} refRBSheet={refRBSheet} />}
      </HiddenInventory>
    </Box>
  );
};

export default BottomDrawer;
