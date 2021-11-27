import { View, Text, Box, Pressable, HStack } from "native-base";
import React, { useState, useEffect } from "react";
import { CharacterName, Foe, PrimaryElement } from "../../common/types";
import FoeImage from "../../Components/FoeImage";
import Icon from "../../Components/Icon";
import AdversaryAbility from "./AdversaryAbility";
import FoeList from "./FoeList";

interface AdversaryPanelProps {
  foesDefeated: string[];
  foe: Foe;
  index: number;
  heroLevel: number;
  character: CharacterName;
  displayRewardItem: (name: string) => void;
  elementType?: Lowercase<PrimaryElement>;
}

export const AdversaryPanel: React.FC<AdversaryPanelProps> = ({ foesDefeated, foe, index, heroLevel, character, displayRewardItem, elementType }) => {
  const [requiredLevel, setRequiredLevel] = useState(null);
  const isOdd = index % 2;
  function determineBackgroundColor(isOdd) {
    if (foe["class"] == "Spirits") {
      return isOdd ? "#F5F5F5" : "base.white";
    } else if (foe["class"] == "Elementals") {
      return isOdd ? `base.${elementType}` : `${elementType}.700`;
    } else {
      return isOdd ? "#212121" : "base.black";
    }
  }

  useEffect(() => {
    // Elemental foes don't have a level requirement, but their item drop DOES have a level requirement
    // The only foes with itemSummonOnly are the elemental bosses, so use 40 if no levelRequirement exist on boss
    if (foe.levelRequirement || foe.itemSummonOnly) {
      setRequiredLevel(foe.levelRequirement ?? 40);
    }
  }, []);

  return (
    <View minHeight={220} bgColor={determineBackgroundColor(isOdd)}>
      {requiredLevel && heroLevel < requiredLevel && (
        <Box zIndex={1001} w="100%" position="absolute" top="35%" bgColor="base.brand">
          <Text fontSize="3xl" fontFamily="heading" textAlign="center" py={3} color="base.white">
            Available at Level {requiredLevel}
          </Text>
        </Box>
      )}
      {isOdd ? (
        <>
          <Box position="absolute" left={-20} bottom={2}>
            <FoeImage width={200} height={200} foeType={foe.type} heroCharacterName={foe.type === "Shadow-Self" ? character : null} />
            <Pressable onPress={() => displayRewardItem(foe.reward.name)}>
              <Text fontSize="lg" textAlign="center" fontFamily="heading" color="base.link" textDecoration="underline">
                Reward
              </Text>
            </Pressable>
          </Box>
          <Box alignItems="flex-end" justifyContent="flex-end" pb={5} pr={2}>
            <Box maxWidth="60%" pt={2}>
              <Text textAlign="right" fontFamily="heading" fontSize={foe.type.length > 18 ? 34 : 38} lineHeight={40} color={foe.class === "Titans" ? "base.white" : "base.primary"}>
                {(foe.levelRequirement || foe.itemSummonOnly) && <Icon iconName="boss" size={35} color={foe.class === "Titans" ? "base.white" : "base.primary"} />}
                {foe.type}
              </Text>

              <AdversaryAbility ability={foe.ability} textDirection="right" />
              <FoeList foesDefeated={foesDefeated} textAlign="right" foes={foe.foe} color={foe.class === "Spirits" ? "base.black" : "base.white"} />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box position="absolute" right={-20} bottom={2}>
            <FoeImage width={200} height={200} foeType={foe.type} heroCharacterName={foe.type === "Shadow-Self" ? character : null} />
            <Pressable onPress={() => displayRewardItem(foe.reward.name)}>
              <Text fontSize="lg" textAlign="center" fontFamily="heading" color="base.link" textDecoration="underline">
                Reward
              </Text>
            </Pressable>
          </Box>
          <Box alignItems="flex-start" justifyContent="flex-end" pl={2}>
            <Box maxWidth="60%" pt={2}>
              <Text fontFamily="heading" fontSize={foe.type.length > 18 ? 34 : 38} lineHeight={40} color={foe.class === "Titans" ? "base.white" : "base.primary"}>
                {(foe.levelRequirement || foe.itemSummonOnly) && <Icon iconName="boss" size={35} color={foe.class === "Titans" ? "base.white" : "base.primary"} />}
                {foe.type}
              </Text>

              <AdversaryAbility ability={foe.ability} textDirection="left" />

              <FoeList foesDefeated={foesDefeated} textAlign="left" foes={foe.foe} color={foe.class === "Spirits" ? "base.black" : "base.white"} />
            </Box>
          </Box>
        </>
      )}
    </View>
  );
};
