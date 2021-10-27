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
import { CharacterName, DefaultHeroProperties, EquippableItemType, Hero, HeroStatus, HeroWithStats, Item, TabType, User } from "../../../../common/types";
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
  const { consumables, pets, skins, titles, codices, equippedPet, equippedSkin, equippedTitle, equip, equipUnequip, unequip } = useInventory();
  const [battleReportAvailable, setBattleReportAvailable] = useState(false);
  const [battleButtonDisabled, setBattleButtonDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("Consumables");
  const [pressedItem, setPressedItem] = useState(null);
  const { photonTokens, qp, goToBattle, id, character, status } = hero;

  async function handleFetchUpcomingBattle() {
    try {
      const { foe, rewards } = await fetchUpcomingFoeAndRewards({ avatarID: id });
      navigation.push("App", { screen: "AwaitingBattle", params: { foe, rewards, character } });
    } catch (error) {
      addToast("error", `${error.status}: ${error.message}`, "top");
      return debugErrors(error, user);
    }
  }

  function handleBattleReport() {
    navigation.push("App", { screen: "BattleReport", params: { battleReport: latestBattle } });
  }

  function handleEquipping(category: EquippableItemType, item?: Item) {
    const equippedOfType = { skin: equippedSkin, pet: equippedPet, title: equippedTitle };

    // If there's no passed item, the user is unequipping
    if (!item) {
      // Equipped item exists in this category, unequip it
      if (equippedOfType[category]) {
        unequip(equippedOfType[category], hero as Hero);
        // User doesn't have an item of the same category already equipped - just return
      } else {
        return;
      }
      // passed item, user is equipping
    } else {
      // User selected the same item, just return
      if (item.name === equippedOfType[category]?.name) {
        return;
        // No existing item equipped of same category, just equip
      } else if (!equippedOfType[category]) {
        console.log("JUST EQUIP=", item.name);
        equip(item, hero as Hero);
        // Existing item of same category, equipUnequip
      } else {
        console.log("BEFORE EQUIPPING = ", item.itemID, equippedOfType[category].itemID);
        equipUnequip(item, equippedOfType[category].itemID, hero as Hero);
      }
    }
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
        {activeTab === "Skins" && <ItemCarousel type="consumable" data={consumables} setPressedItem={setPressedItem} refRBSheet={refRBSheet} />}
        {activeTab === "Pets" && <ItemCarousel type="pet" data={pets} equipped={equippedPet} setPressedItem={setPressedItem} refRBSheet={refRBSheet} handleEquipping={handleEquipping} />}
        {activeTab === "Costumes" && <ItemCarousel type="skin" data={skins} equipped={equippedSkin} character={hero.character} setPressedItem={setPressedItem} refRBSheet={refRBSheet} handleEquipping={handleEquipping} />}
        {activeTab === "Titles" && <ItemCarousel type="title" data={titles} equipped={equippedTitle} setPressedItem={setPressedItem} refRBSheet={refRBSheet} handleEquipping={handleEquipping} />}
        {activeTab === "Codices" && <ItemCarousel type="codex" data={codices} setPressedItem={setPressedItem} refRBSheet={refRBSheet} />}
      </HiddenInventory>
    </Box>
  );
};

export default BottomDrawer;
