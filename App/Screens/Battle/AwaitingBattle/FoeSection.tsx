import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { VStack, Text, Box } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { getFoeColor } from "../../../common/helperFunctions";
import { Foe } from "../../../common/types";
import FoeImage from "../../../Components/FoeImage";

interface FoeSectionProps {
  height: number;
  foe: Foe;
}

const FoeSection: React.FC<FoeSectionProps> = ({ height, foe }) => {
  const foeColors = ["#ffffff", getFoeColor(foe.type)];

  return (
    <Box w="100%" flex={1}>
      <LinearGradient end={{ x: 1, y: 0.5 }} colors={foeColors} style={styles.foeGradient} />
      <Box position="absolute" right={-40} bottom={-50}>
        <FoeImage width={height * 0.5} height={height * 0.5} foeType={foe.type} heroCharacterName={foe.type === "Shadow Self" ? state.hero.character : null} />
      </Box>
      <VStack position="absolute" left={1} bottom={1}>
        <Text fontSize={foe.name.length > 10 ? 37 : 50} fontFamily="heading">
          {foe.name}
        </Text>
        <Text color="primary.800" mt={-8} fontSize={30}>
          {foe.type}
        </Text>
      </VStack>
    </Box>
  );
};

export default FoeSection;

const styles = StyleSheet.create({
  foeGradient: { height: "100%", width: "100%" },
});
