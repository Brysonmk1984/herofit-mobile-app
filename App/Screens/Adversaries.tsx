import React, { useContext, useEffect, useState } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from "native-base";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import { MainDrawerParamList, MainDrawerProps } from "../common/types-navigator";
import { DrawerIndicator, Header } from "../Components/CustomComponents";
import { fetchBattlesWonOrDkoByAvatarID, getVillainList } from "../api/battle";
import debugErrors from "../common/debugErrors";
import useGlobalToast from "../common/hooks/useGlobalToast";
import { Battle } from "../common/types-battle";
import { Item } from "../common/types";
import ItemDetail from "./Home/Components/BottomDrawer/HiddenInventory/Modals/ItemDetail";
import useModal from "../common/hooks/useModal";

const Adversaries: React.FC<MainDrawerProps<"Adversaries">> = ({ navigation, route }) => {
  const { openModal } = useModal();
  const { addToast } = useGlobalToast();
  const { heroId, allGameItems, character } = route.params;
  const [foesDefeated, setFoesDefeated] = useState([]);
  const [villains, setVillains] = useState([]);
  const [pressedItem, setPressedItem] = useState<Item>(null);

  // Show Reward Item
  function handleItemClick(item: Item) {
    const matchedItem = allGameItems.find((gameItem: Item) => gameItem.name === item.name);
    setPressedItem(matchedItem);
    openModal("ItemDetail");
  }

  useEffect(() => {
    (async () => {
      if (heroId) {
        try {
          const [p1, p2] = await Promise.all([fetchBattlesWonOrDkoByAvatarID({ avatarID: heroId }), getVillainList()]);
          const { battles } = p1;
          const { villains } = p2;

          console.log("BATTLES & VILLAINS", battles, villains);

          setFoesDefeated(battles.map((battle: Battle) => battle.foe.name));
          setVillains(villains);
        } catch (error) {
          addToast("error", error.message);
          return debugErrors(error);
        }
      }
    })();
  }, [heroId]);

  return (
    <ScreenContainer screenName={route.name}>
      <Center>
        <Header text="Adversaries" />
      </Center>
      <DrawerIndicator />
      {pressedItem && <ItemDetail id="ItemDetail" item={pressedItem} character={character} />}
    </ScreenContainer>
  );
};

export default Adversaries;
