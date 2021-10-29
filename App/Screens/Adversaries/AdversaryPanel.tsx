import { View, Text, Box, Pressable } from "native-base";
import React from "react";
import useModal from "../../common/hooks/useModal";
import { CharacterName, Foe, PrimaryElement } from "../../common/types";
import FoeImage from "../../Components/FoeImage";
import AdversaryAbility from "./AdversaryAbility";
import FoeList from "./FoeList";

interface AdversaryPanelProps {
  foesDefeated: string[];
  foe: Foe;
  index: number;
  character: CharacterName;
  elementType?: Lowercase<PrimaryElement>;
  displayRewardItem: (name: string) => void;
}

export const AdversaryPanel: React.FC<AdversaryPanelProps> = ({ foesDefeated, foe, index, character, elementType, displayRewardItem }) => {
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

  return (
    <View minHeight={220} bgColor={determineBackgroundColor(isOdd)}>
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
          <Box alignItems="flex-end" pb={5} pr={2}>
            <Box maxWidth="60%">
              <Text textAlign="right" fontFamily="heading" fontSize={foe.type.length > 19 ? 35 : 40}>
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
          <Box alignItems="flex-start" pl={2}>
            <Box maxWidth="60%">
              <Text fontFamily="heading" fontSize={foe.type.length > 19 ? 35 : 40}>
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
