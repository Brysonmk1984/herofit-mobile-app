import React, { useContext, useEffect, useState } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, ScrollView } from "native-base";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { MainDrawerParamList, MainDrawerProps } from "../../common/types-navigator";
import { DrawerIndicator, Header, Icon } from "../../Components/CustomComponents";
import { fetchBattlesWonOrDkoByAvatarID, getVillainList } from "../../api/battle";
import debugErrors from "../../common/debugErrors";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import { Battle } from "../../common/types-battle";
import { FoeClass, FoeType, Item, PrimaryElement } from "../../common/types";
import ItemDetail from "../Home/Components/BottomDrawer/HiddenInventory/Modals/ItemDetail";
import useModal from "../../common/hooks/useModal";
import { GlobalStateContext } from "../../store";
import AdversaryTabs from "./AdversaryTabs";
import FoeImage from "../../Components/FoeImage";
import { AdversaryPanel } from "./AdversaryPanel";

const fireFoes = ["Flame Fiend", "Burning Jinn", "Scorching Archfiend"];
const earthFoes = ["Rock Skipper", "Granite Golem", "Hulking Aggro Crag"];
const waterFoes = ["Splash Artist", "Cyclonic Siren", "High Priestess of the Tides"];
const airFoes = ["Gusty Rascal", "Wheezing Jinn", "Storming Oni"];

const Adversaries: React.FC<MainDrawerProps<"Adversaries">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal } = useModal();
  const { addToast } = useGlobalToast();

  const { hero, allGameItems } = state;
  const [foesDefeated, setFoesDefeated] = useState([]);
  const [villains, setVillains] = useState({ Spirits: [], Elementals: [], Titans: [] });
  const [sectionedElementals, setSectionedElementals] = useState(null);
  const [pressedItem, setPressedItem] = useState<Item>(null);
  const [activeTab, setActiveTab] = useState<FoeClass>("Spirits");

  // Show Reward Item
  function handleItemClick(itemName: string) {
    const matchedItem = allGameItems.find((gameItem: Item) => gameItem.name === itemName);
    setPressedItem(matchedItem);
    openModal("AdversaryItemDetail");
  }

  function determineElementalElement(foeType: FoeType): Lowercase<PrimaryElement> | null {
    if (fireFoes.includes(foeType)) {
      return "fire";
    } else if (earthFoes.includes(foeType)) {
      return "earth";
    } else if (waterFoes.includes(foeType)) {
      return "water";
    } else if (airFoes.includes(foeType)) {
      return "air";
    } else {
      throw new Error("No Matching Element for Foe");
    }
  }

  function renderItem({ item, index }) {
    return <AdversaryPanel foesDefeated={foesDefeated} foe={item} index={index} character={hero.character} elementType={item.class === "Elementals" ? determineElementalElement(item.type) : null} displayRewardItem={handleItemClick} />;
  }

  useEffect(() => {
    (async () => {
      if (hero.id) {
        try {
          const [p1, p2] = await Promise.all([fetchBattlesWonOrDkoByAvatarID({ avatarID: hero.id }), getVillainList()]);
          const { battles } = p1;
          const { villains } = p2;

          setSectionedElementals([
            {
              title: "fire",
              data: villains.Elementals.filter(f => fireFoes.includes(f.type)),
            },
            {
              title: "earth",
              data: villains.Elementals.filter(f => earthFoes.includes(f.type)),
            },
            {
              title: "water",
              data: villains.Elementals.filter(f => waterFoes.includes(f.type)),
            },
            {
              title: "air",
              data: villains.Elementals.filter(f => airFoes.includes(f.type)),
            },
          ]);

          setVillains(villains);
          const defeatedFoeList = battles.map((battle: Battle) => battle.foe.name).reduce((acc, foe) => (acc.includes(foe) ? acc : [...acc, foe]), []);

          // Needed to detect Shadow-Self name
          const indexOfShadow = defeatedFoeList.findIndex(s => s.includes("Shadow "));
          if (indexOfShadow) {
            defeatedFoeList.splice(indexOfShadow, 1, "Shadow-Self");
          }

          setFoesDefeated(defeatedFoeList);
        } catch (error) {
          addToast("error", error.message);
          return debugErrors(error);
        }
      }
    })();
  }, [hero.id]);

  return (
    <ScreenContainer screenName={route.name}>
      <DrawerIndicator />
      <Header text="Adversaries" />
      <Center flex={3} bgColor="base.white">
        <AdversaryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ScrollView w="100%">
          {activeTab === "Elementals" ? (
            // Elemental Foe list is structered differently using a SectionList
            <SectionList
              renderSectionHeader={({ section: { title } }) => (
                <HStack bgColor={`base.${title}`} py={3} px={2}>
                  <Icon iconName={title} size={30} color="base.white" />
                  <Text fontFamily="heading" fontSize={35} color="white" pl={3} mt={-1}>
                    {title}
                  </Text>
                </HStack>
              )}
              sections={sectionedElementals}
              renderItem={(item, index) => renderItem(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            // Other Foes
            <FlatList data={villains[activeTab]} renderItem={item => renderItem(item)} keyExtractor={(item, index) => index.toString()} />
          )}
        </ScrollView>
      </Center>
      {pressedItem && <ItemDetail id="AdversaryItemDetail" item={pressedItem} character={hero.character} />}
    </ScreenContainer>
  );
};

export default Adversaries;
