import React from "react";
import { StyleSheet } from "react-native";
import { VStack, Text, Pressable, Box, Center } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import herofitTheme from "../../../styles/herofitTheme";
import { BattleFoe, BattleOutcome } from "../../../common/types-battle";
import { Hero } from "../../../common/types";
import { rankingSuffix } from "../../../common/helperFunctions";

interface OutcomeSectionProps {
  height: number;
  push: (count?: number) => void;
  top: Hero | BattleFoe;
  bottom: Hero | BattleFoe;
  outcome: BattleOutcome;
  endRound: number;
  legacyBattle: boolean;
}

const OutcomeSection: React.FC<OutcomeSectionProps> = ({ height, push, top, bottom, outcome, endRound, legacyBattle = false }) => {
  const vsColors = ["transparent", "#ffffff", "transparent"];
  const topNameSize = determineNameSize(top.name.length);
  const bottomNameSize = determineNameSize(bottom.name.length);

  function determineNameSize(length: number) {
    return length > 10 ? 37 : bottom.name.length > 6 ? 50 : 66;
  }

  function renderHeadline() {
    if (outcome === "Draw") {
      return (
        <Center>
          <Text fontSize={topNameSize} fontFamily="heading">
            {top.name}
          </Text>
          <Text style={styles.textShadow} fontSize={70} fontFamily="heading">
            - draw -
          </Text>
          <Text fontSize={bottomNameSize} fontFamily="heading">
            {bottom.name}
          </Text>
        </Center>
      );
    } else if (outcome === "Double KO") {
      return (
        <Center>
          <Text fontSize={topNameSize} fontFamily="heading">
            {top.name}
          </Text>
          <Text style={styles.textShadow} fontSize={70} fontFamily="heading">
            - double KO -
          </Text>
          <Text fontSize={bottomNameSize} fontFamily="heading">
            {bottom.name}
          </Text>
        </Center>
      );
    }

    return (
      <Center>
        <Text fontSize={topNameSize} fontFamily="heading">
          {top.name}
        </Text>
        <Text style={styles.textShadow} fontSize={70} fontFamily="heading">
          - defeats -
        </Text>
        <Text fontSize={bottomNameSize} fontFamily="heading">
          {bottom.name}
        </Text>
      </Center>
    );
  }

  function renderBattleResultPredicate(outcome: BattleOutcome, endRound: number, legacyBattle: boolean) {
    if (legacyBattle) {
      return "";
    }
    if (outcome === "Foe Wins" || outcome === "Avatar Wins") {
      return `${endRound}${rankingSuffix(endRound)} Round KO`;
    } else if (outcome === "Draw") {
      return `No Winner After ${endRound} Rounds`;
    } else if (outcome === "Double KO") {
      if (!legacyBattle) {
        return `In the ${endRound}${rankingSuffix(endRound)} Round`;
      }
      return "Both Hero & Foe KOed";
    }
  }

  return (
    <VStack zIndex={100} h={height * 0.45} w="100%" justifyContent="center" alignItems="center" position="absolute" top={height * 0.26}>
      <LinearGradient colors={vsColors} style={styles.vsGradient} alignItems="center" />
      <Pressable onPress={() => push()}>
        <Box justifyContent="center" alignItems="center">
          {renderHeadline()}
        </Box>
        <Center>
          <Text fontFamily="heading" color="base.white">
            {" "}
            {renderBattleResultPredicate(outcome, endRound, legacyBattle)}
          </Text>
        </Center>
      </Pressable>
    </VStack>
  );
};

export default OutcomeSection;

const { textShadowColor } = herofitTheme.colors.base;
const styles = StyleSheet.create({
  vsGradient: { height: "100%", width: "100%", position: "absolute" },
  textShadow: {
    textShadowColor: textShadowColor,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
});
