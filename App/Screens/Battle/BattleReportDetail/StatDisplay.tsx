import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { View, Text, useTheme, Box, Center, VStack, HStack, ScrollView } from "native-base";
import { Icon } from "../../../Components/CustomComponents";
import { LinearGradient } from "expo-linear-gradient";
import { determineScenario } from "../../../common/helperFunctions";
import moment from "moment";
import { BattleDetailOnly, BattleEffectProc, BattleReportStats, BattleSeasonalBonusElement } from "../../../common/types-battle";
import { Stat } from "../../../common/types";
import useAspectRatio from "../../../common/hooks/useAspectRatio";

interface StatDisplayProps {
  battleReport: BattleDetailOnly;
  setSelectedAttribute: (attribute: Lowercase<Stat>) => void;
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

const StatDisplay: React.FC<StatDisplayProps> = ({ battleReport, setSelectedAttribute }) => {
  const { deviceAspectType } = useAspectRatio();
  const { outcome, scenario, roundBreakdown, avatar: hero, bra: brh, foe, brf, foeType, effects, updatedAt, seasonalBonusElement, effectProcs } = battleReport;
  const nonNullEffectProcs = effectProcs ?? [];
  const gradient = ["transparent", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "transparent"];
  const stats: BattleReportStats = ["health", "power", "armor", "fire", "earth", "water", "air", "aether"];
  const [allEffectProcs, setAllEffectProcs] = useState(nonNullEffectProcs);

  const {
    postbattle: postProcs,
    prebattle: preProcs,
    battle: battleProcs,
  } = nonNullEffectProcs.reduce(
    (acc, cur) => {
      if (cur.type === "prebattle") {
        acc.prebattle.push(cur.effect);
      } else if (cur.type === "battle") {
        acc.battle.push(cur.effect);
      } else if (cur.type === "postbattle") {
        acc.postbattle.push(cur.effect);
      }

      return acc;
    },
    { prebattle: [], battle: [], postbattle: [] },
  );

  function renderStatRows(stat: BattleReportStats) {
    if (stat === "aether" && !brf.aether && !brh.aether) {
      return null;
    }
    const effectHero = allEffectProcs
      .filter(ep => ep?.heroStatsEffected?.includes(stat))
      .map(ep => (ep.effect.length > 17 ? `${ep.effect.slice(0, 17)}...` : ep.effect))
      .join("\n");
    const statHero = brh[stat] || 0;
    const statFoe = brf[stat] || 0;
    const effectFoe = allEffectProcs
      .filter(ep => ep?.foeStatsEffected?.includes(stat))
      .map(ep => (ep.effect.length > 17 ? `${ep.effect.slice(0, 17)}...` : ep.effect))
      .join("\n");

    return (
      <HStack alignItems="center">
        {/* Effect - Hero */}
        <Box flex={3} px={1}>
          <Text fontSize="sm">{effectHero}</Text>
        </Box>
        {/* Stat - Hero */}
        <Box flex={1} py={1} bgColor="base.highlightTransparent" borderLeftWidth={1}>
          <Text color={determineStatColor(hero[stat], brh[stat])} fontSize="2xl" fontFamily="heading" textAlign="center">
            {Math.floor(statHero)}
          </Text>
        </Box>
        {/* Stat */}
        <Box alignItems="center" py={1} h="100%" bgColor="base.highlightTransparent">
          <Pressable onPress={() => setSelectedAttribute(stat)}>
            <Icon iconName={stat} size={30} color={`base.${stat}`} />
          </Pressable>
        </Box>
        {/* Stat - Foe */}
        <Box flex={1} py={1} bgColor="base.highlightTransparent" borderRightWidth={1}>
          <Text color={determineStatColor(foe[stat], brf[stat])} fontSize="2xl" fontFamily="heading" textAlign="center">
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
      <Center mb={2}>
        <Text fontSize={20} color={battleReport.outcome === "Avatar Wins" ? "primary.800" : "primary.200"}>
          {battleDate.format("MM-DD-YYYY")}
        </Text>
      </Center>
    ) : null;
  }

  function renderPreProcs(procs: BattleEffectProc[]) {
    return procs?.length ? (
      <Center p={2} borderTopWidth={1}>
        <Text fontFamily="heading" fontSize={20}>
          Pre-Battle Effects
        </Text>
        <FlatList data={procs} renderItem={({ item }) => <Text>{item}</Text>} keyExtractor={(item, index) => index.toString()} />{" "}
      </Center>
    ) : null;
  }

  function renderBattleProcs(procs: BattleEffectProc[]) {
    return procs?.length ? (
      <Center p={2} borderTopWidth={1}>
        <Text fontFamily="heading" fontSize={20}>
          Battle Effects
        </Text>
        <FlatList data={procs} renderItem={({ item }) => <Text>{item}</Text>} keyExtractor={(item, index) => index.toString()} />
      </Center>
    ) : null;
  }

  function renderPostProcs(procs: BattleEffectProc[]) {
    return procs?.length ? (
      <Center p={2} borderTopWidth={1}>
        <Text fontFamily="heading" fontSize={20}>
          Post-Battle Effects
        </Text>
        <FlatList data={procs} renderItem={({ item }) => <Text>{item}</Text>} keyExtractor={(item, index) => index.toString()} />
      </Center>
    ) : null;
  }

  useEffect(() => {
    const elementalBonusProc = determineElementalBonusProc(seasonalBonusElement);
    const scenarioBonusProc = determineScenarioBonusProc(scenario);
    setAllEffectProcs([...nonNullEffectProcs, elementalBonusProc, scenarioBonusProc]);
  }, []);

  return (
    <View mt={-8}>
      <ScrollView>
        {/* DATE */}
        {deviceAspectType !== "short" && renderDate(updatedAt)}
        {/* NAMES */}
        <HStack bgColor="base.highlightTransparent" borderTopWidth={1}>
          <Text fontSize={hero.name.length > 12 ? 30 : hero.name.length > 8 ? 35 : 40} flex="1" fontFamily="heading" textAlign="left" px={2} borderRightWidth={1}>
            {hero.name}
          </Text>
          <Text fontSize={foe.name.length > 12 ? 30 : foe.name.length > 8 ? 35 : 40} flex="1" fontFamily="heading" textAlign="right" px={2}>
            {foe.name}
          </Text>
        </HStack>

        {/* TABLE HEADER */}
        <HStack bgColor="base.highlightTransparent" justifyContent="center" borderBottomWidth={1} borderTopWidth={1} p={1}>
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
        {/* SCENARIO */}
        <Center bgColor="base.highlightTransparent" py={1} borderTopWidth={1} borderBottomWidth={1}>
          <Text fontSize={13}>Scenario: {determineScenario(scenario).type}</Text>
        </Center>
        {renderPreProcs(preProcs)}
        {renderBattleProcs(battleProcs)}
        {renderPostProcs(postProcs)}
      </ScrollView>
    </View>
  );
};

export default StatDisplay;
