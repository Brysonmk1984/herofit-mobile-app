import React, { useContext, useEffect, useState } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, ScrollView } from "native-base";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { MainDrawerParamList, MainDrawerProps } from "../../common/types-navigator";
import { DrawerIndicator, Header } from "../../Components/CustomComponents";
import { fetchBattlesWonOrDkoByAvatarID, getVillainList } from "../../api/battle";
import debugErrors from "../../common/debugErrors";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import { Battle } from "../../common/types-battle";
import { FoeClass, Item } from "../../common/types";
import ItemDetail from "../Home/Components/BottomDrawer/HiddenInventory/Modals/ItemDetail";
import useModal from "../../common/hooks/useModal";
import { GlobalStateContext } from "../../store";
import AdversaryTabs from "./AdversaryTabs";

const Adversaries: React.FC<MainDrawerProps<"Adversaries">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal } = useModal();
  const { addToast } = useGlobalToast();
  const { hero, allGameItems } = state;
  const [foesDefeated, setFoesDefeated] = useState([]);
  const [villains, setVillains] = useState({ Spirits: [], Elementals: [], Titans: [] });
  const [pressedItem, setPressedItem] = useState<Item>(null);
  const [activeTab, setActiveTab] = useState<FoeClass>("Spirits");

  // Show Reward Item
  function handleItemClick(item: Item) {
    const matchedItem = allGameItems.find((gameItem: Item) => gameItem.name === item.name);
    setPressedItem(matchedItem);
    openModal("AdversaryItemDetail");
  }

  function renderItem({ item }) {
    return (
      <View minHeight={200} bgColor={item["class"] == "Spirits" ? "base.white" : item["class"] == "Elementals" ? "base.fire" : "base.black"}>
        <Text>{item.type}</Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      if (hero.id) {
        try {
          const [p1, p2] = await Promise.all([fetchBattlesWonOrDkoByAvatarID({ avatarID: hero.id }), getVillainList()]);
          const { battles } = p1;
          const { villains } = p2;

          // const fireFoes = ["Flame Fiend", "Burning Jinn", "Scorching Archfiend"];
          // const earthFoes = ["Rock Skipper", "Granite Golem", "Hulking Aggro Crag"];
          // const waterFoes = ["splash Artist", "Cyclonic Siren", "High Priestess of the Tides"];
          // const airFoes = ["Gusty Rascal", "Wheezing Jinn", "Storming Oni"];
          // const allElementals = [...fireFoes, ...earthFoes, ...waterFoes, ...airFoes].map(foeString => villains.Elementals.find(foe => foe.type === foeString));
          // console.log("ELEMS", allElementals);
          // console.log("BATTLES & VILLAINS", battles, villains);
          // const orderedVillains = {
          //   Spirits: villains.Spirits,
          //   Elementals: allElementals,
          //   Titans: villains.Titans,
          // };

          setFoesDefeated(battles.map((battle: Battle) => battle.foe.name));
          setVillains(villains);
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
      <Center bgColor="base.white">
        <AdversaryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ScrollView minHeight="80%" w="100%">
          <FlatList data={villains[activeTab]} renderItem={item => renderItem(item)} keyExtractor={(item, index) => index.toString()} />
        </ScrollView>
      </Center>
      {pressedItem && <ItemDetail id="AdversaryItemDetail" item={pressedItem} character={hero.character} />}
    </ScreenContainer>
  );
};

export default Adversaries;
