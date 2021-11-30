import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { VStack, Text, Pressable, Box, Center } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import herofitTheme from "../../../styles/herofitTheme";
import { BattleFoe, BattleOutcome } from "../../../common/types-battle";
import { Hero } from "../../../common/types";
import { rankingSuffix } from "../../../common/helperFunctions";

interface OutcomeSectionProps {
  height: number;
  push: () => void;
  top: Hero | BattleFoe;
  bottom: Hero | BattleFoe;
  outcome: BattleOutcome;
  endRound: number;
  legacyBattle: boolean;
}

const OutcomeSection: React.FC<OutcomeSectionProps> = ({ height, push, top, bottom, outcome, endRound, legacyBattle = false }) => {
  const topNameSize = determineNameSize(top.name.length);
  const bottomNameSize = determineNameSize(bottom.name.length);

  function determineNameSize(length: number) {
    return length > 10 ? 37 : bottom.name.length > 6 ? 50 : 66;
  }

  function renderHeadline() {
    if (outcome === "Draw") {
      return (
        <Center>
          <Text fontSize={topNameSize} lineHeight={topNameSize} fontFamily="heading">
            {top.name}
          </Text>
          <Text style={styles.textShadow} fontSize={70} fontFamily="heading" lineHeight={90}>
            - draw -
          </Text>
          <Text fontSize={bottomNameSize} lineHeight={bottomNameSize + 15} fontFamily="heading">
            {bottom.name}
          </Text>
        </Center>
      );
    } else if (outcome === "Double KO") {
      return (
        <Center>
          <Text fontSize={topNameSize} lineHeight={topNameSize} fontFamily="heading">
            {top.name}
          </Text>
          <Text style={styles.textShadow} fontSize={70} fontFamily="heading" lineHeight={90}>
            - double KO -
          </Text>
          <Text fontSize={bottomNameSize} lineHeight={bottomNameSize + 15} fontFamily="heading">
            {bottom.name}
          </Text>
        </Center>
      );
    }

    return (
      <Center>
        <Text fontSize={topNameSize} lineHeight={topNameSize} fontFamily="heading">
          {top.name}
        </Text>
        <Text style={styles.textShadow} fontSize={70} fontFamily="heading" lineHeight={90}>
          - defeats -
        </Text>
        <Text fontSize={bottomNameSize} lineHeight={bottomNameSize + 15} fontFamily="heading">
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
    <VStack zIndex={100} h={height * 0.45} w="100%" position="absolute" left={0} top={height * 0.26}>
      <Pressable onPress={push}>
        <ImageBackground
          style={{
            width: "100%",
            height: "120%",
            marginTop: "-20%",
          }}
          source={require("../../../../assets/images/layout/battle-gradient.webp")}
          resizeMode="cover"
        >
          <Center marginTop="20%">
            <Box justifyContent="center">{renderHeadline()}</Box>
            <Text fontFamily="heading" fontSize="xl" color="base.white">
              {renderBattleResultPredicate(outcome, endRound, legacyBattle)}
            </Text>
          </Center>
        </ImageBackground>
      </Pressable>
    </VStack>
  );
};

export default OutcomeSection;

const { textShadowColor } = herofitTheme.colors.base;
const styles = StyleSheet.create({
  textShadow: {
    textShadowColor: textShadowColor,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
});
