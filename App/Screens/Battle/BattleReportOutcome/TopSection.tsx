import React, { useContext, useEffect, useRef } from "react";
import { Box, VStack, Text, View } from "native-base";
import { Animated, FlatList } from "react-native";
import FoeImage from "../../../Components/FoeImage";
import { HeroImage } from "../../../Components/HeroImage/HeroImage";
import { CharacterName, Hero, Item } from "../../../common/types";
import { BattleFoe, BattleOutcome } from "../../../common/types-battle";
import Rewards from "./Rewards";
import useInventory from "../../../common/hooks/useInventory";

interface TopSectionProps {
  height: number;
  outcome: BattleOutcome;
  contender: Hero | BattleFoe;
  contenderType: "hero" | "foe";
  xpGain: number;
  ptGain: number;
  setPressedItem: (item: Item) => void;
  itemsAcquired?: Item[];
  // Foe needs Character name for potential Shadow-Self fight
  character?: CharacterName;
}

const TopSection: React.FC<TopSectionProps> = ({ height: deviceHeight, outcome, contender, contenderType, xpGain, ptGain, itemsAcquired, character, setPressedItem }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { equippedSkin } = useInventory(true);

  function determinePropsForImage(contender: Hero | BattleFoe, contenderType: "hero" | "foe") {
    if (contenderType === "hero") {
      const { character, equipped, alias } = contender as Hero;
      return { width: deviceHeight * 0.45, height: deviceHeight * 0.45, character, alias, skin: equippedSkin };
    } else {
      contender = contender as BattleFoe;
      return { width: deviceHeight * 0.45, height: deviceHeight * 0.45, foeType: contender.type, heroCharacterName: contender.type === "Shadow-Self" ? character : null };
    }
  }

  const fadeIn = () => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <Box flex={1}>
      <Animated.View position="absolute" left={-95} top={-25} zIndex={1} style={{ opacity: opacityAnim }}>
        {contenderType === "hero" ? <HeroImage width={deviceHeight * 0.3} height={deviceHeight * 0.3} skin={equippedSkin} {...determinePropsForImage(contender, contenderType)} /> : <FoeImage {...determinePropsForImage(contender, contenderType)} />}
      </Animated.View>
      <Rewards reversedText={outcome !== "Avatar Wins"} topOrBottom={"top"} itemsAcquired={itemsAcquired} ptGain={ptGain} xpGain={xpGain} setPressedItem={setPressedItem} />
    </Box>
  );
};

export default TopSection;
