import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { View, Text, useTheme, Box, Center, VStack, HStack, ScrollView } from "native-base";
import { Icon } from "../../../Components/CustomComponents";
import { LinearGradient } from "expo-linear-gradient";
import { determineScenario } from "../../../common/helperFunctions";
import moment from "moment";
import { BattleDetailOnly, BattleEffectProc, BattleReportStats, BattleSeasonalBonusElement } from "../../../common/types-battle";

interface StatDisplayProps {
  battleReport: BattleDetailOnly;
}

function determineScenarioBonusProc(scenario: number): BattleEffectProc {
  switch (scenario) {
    case 0:
      return {
        effect: `Battle Scenario`,
        heroStatsEffected: ["power"],
        foeStatsEffected: ["health"],
      };
    case 1:
      return {
        effect: `Battle Scenario`,
        foeStatsEffected: ["health"],
      };
    case 2:
      return {
        effect: `Battle Scenario`,
        heroStatsEffected: ["power"],
        foeStatsEffected: ["power"],
      };
    case 3:
      return {
        effect: `Battle Scenario`,
        heroStatsEffected: ["health"],
        foeStatsEffected: ["power"],
      };
    case 4:
      return {
        effect: `Battle Scenario`,
        heroStatsEffected: ["health"],
      };
    case 5:
      return {
        effect: `Battle Scenario`,
        heroStatsEffected: ["health"],
        foeStatsEffected: ["health"],
      };
    default:
      break;
  }
}

function determineElementalBonusProc(seasonalBonusElement: BattleSeasonalBonusElement): BattleEffectProc {
  const elementLC = seasonalBonusElement.element.toLowerCase();
  return {
    effect: `${seasonalBonusElement.sign} Season`,
    heroStatsEffected: [elementLC],
    foeStatsEffected: [elementLC],
  };
}

function determineStatColor(base: number, battleTime: number) {
  return battleTime > base ? "base.success" : battleTime < base ? "base.error" : "base.primary";
}

const StatDisplay: React.FC<StatDisplayProps> = ({ battleReport }) => {
  const { height } = useWindowDimensions();
  const { outcome, scenario, roundBreakdown, avatar: hero, bra: brh, foe, brf, foeType, effects, updatedAt, seasonalBonusElement, effectProcs } = battleReport;
  const gradient = ["transparent", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "transparent"];
  const stats: BattleReportStats = ["health", "power", "armor", "fire", "earth", "water", "air", "aether"];
  const [allEffectProcs, setAllEffectProcs] = useState(effectProcs);

  function renderStatRows(stat: BattleReportStats) {
    if (stat === "aether" && !brf.aether && !brh.aether) {
      return null;
    }
    const effectHero = allEffectProcs
      .filter(ep => ep?.heroStatsEffected?.includes(stat))
      .map(ep => ep.effect)
      .join(", ");
    const statHero = brh[stat] || 0;
    const statFoe = brf[stat] || 0;
    const effectFoe = allEffectProcs
      .filter(ep => ep?.foeStatsEffected?.includes(stat))
      .map(ep => ep.effect)
      .join(", ");

    return (
      <HStack>
        {/* Effect - Hero */}
        <Box flex={3} px={1}>
          <Text fontSize="sm">{effectHero}</Text>
        </Box>
        {/* Stat - Hero */}
        <Box flex={1} borderRightWidth={1} px={1}>
          <Text color={determineStatColor(hero[stat], brh[stat])} fontSize="2xl" fontFamily="heading" textAlign="right">
            {Math.floor(statHero)}
          </Text>
        </Box>
        {/* Stat */}
        <Box alignItems="center" flex={1}>
          <Icon iconName={stat} size={30} color={`base.${stat}`} />
        </Box>
        {/* Stat - Foe */}
        <Box flex={1} borderLeftWidth={1} px={1}>
          <Text color={determineStatColor(foe[stat], brf[stat])} fontSize="2xl" fontFamily="heading">
            {Math.floor(statFoe)}
          </Text>
        </Box>
        {/* Effect - Foe */}
        <Box flex={3} px={1}>
          <Text fontSize="sm" textAlign="right">
            {effectFoe}
          </Text>
        </Box>
      </HStack>
    );
  }

  function renderDate(updatedAt: Date) {
    const battleDate = moment(updatedAt);
    const isAfterChange = battleDate.isAfter("2021-10-14");
    return isAfterChange ? (
      <Center>
        <Text fontSize={20} color="primary.700">
          {battleDate.format("MM-DD-YYYY")}
        </Text>
      </Center>
    ) : null;
  }

  useEffect(() => {
    const elementalBonusProc = determineElementalBonusProc(seasonalBonusElement);
    const scenarioBonusProc = determineScenarioBonusProc(scenario);

    setAllEffectProcs([...effectProcs, elementalBonusProc, scenarioBonusProc]);
  }, []);

  return (
    <ScrollView>
      {/* DATE */}
      {renderDate(updatedAt)}
      {/* NAMES */}
      <HStack>
        <Text fontSize={hero.name.length > 10 ? 20 : hero.name.length > 7 ? 30 : 40} flex="1" fontFamily="heading" textAlign="left" px={2}>
          {hero.name}
        </Text>
        <Text fontSize={foe.name.length > 10 ? 20 : foe.name.length > 7 ? 30 : 40} flex="1" fontFamily="heading" textAlign="right" px={2}>
          {foe.name}
        </Text>
      </HStack>
      {/* SCENARIO */}
      <Center borderTopWidth={1}>
        <Text fontFamily="heading" fontSize={20}>
          {determineScenario(scenario).type}
        </Text>
      </Center>
      {/* TABLE HEADER */}
      <HStack justifyContent="center" borderBottomWidth={1} borderTopWidth={1} p={1}>
        <Text fontSize={20} flex="2" fontFamily="heading" textAlign="left">
          Effects
        </Text>
        <Text borderLeftWidth={1} borderRightWidth={1} fontSize={20} flex="2" fontFamily="heading" textAlign="center">
          Stats
        </Text>
        <Text fontSize={20} flex="2" fontFamily="heading" textAlign="right">
          Effects
        </Text>
      </HStack>
      {/* STATS */}
      <FlatList data={stats} renderItem={({ item }) => renderStatRows(item)} keyExtractor={(item, index) => index.toString()} />
      <Center p={2} borderTopWidth={1}>
        <Text fontFamily="heading" fontSize={20}>
          Post-Battle Effects
        </Text>
        <FlatList data={effectProcs.filter(ep => ep.type === "postbattle").map(ep => ep.effect)} renderItem={({ item }) => <Text>{item}</Text>} keyExtractor={(item, index) => index.toString()} />
      </Center>
    </ScrollView>
  );
};

export default StatDisplay;
