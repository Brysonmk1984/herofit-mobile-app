import React from "react";
import { View, Text, ScrollView, Box, VStack, HStack, FlatList, Center, Pressable } from "native-base";
import { BattleDetailOnly } from "../../../common/types-battle";
import { Icon, Subheader } from "../../../Components/CustomComponents";
import { Stat } from "../../../common/types";

interface RoundDisplayProps {
  battleReport: BattleDetailOnly;
  setSelectedAttribute: (attribute: Lowercase<Stat>) => void;
}

const RoundDisplay: React.FC<RoundDisplayProps> = ({ battleReport, setSelectedAttribute }) => {
  function renderAttackDamage(didCrit: boolean, damage: number) {
    return didCrit ? (
      <Text mt={-2} fontSize="3xl" color="base.fire" fontWeight="bold" fontStyle="italic" textAlign="center" fontFamily="handwriting">
        {damage}
      </Text>
    ) : (
      <Text fontSize="md" lineHeight="2xl" textAlign="center">
        {damage}
      </Text>
    );
  }

  function renderRoundRow(round) {
    const { turn, aggressor, defender, elementalDamageDealt, physicalDamageDealt, physicalReduction, elementalReduction, elementalProcs, aggressorHealthLeft, defenderHealthLeft } = round;
    const aHealthLeft = Math.floor(aggressorHealthLeft);
    const dHealthLeft = Math.floor(defenderHealthLeft);
    const amountBlocked = physicalReduction + elementalReduction.total;
    const attackAmount = physicalDamageDealt + elementalDamageDealt.total + amountBlocked;
    const aggressorIsHero = aggressor === "Avatar";
    const didEvade = elementalProcs.air?.evaded ?? false;
    const didCrit = elementalProcs.fire?.critDamage > 0;
    const didHeal = elementalProcs.water?.amountHealed > 0;
    const didThornsToHero = elementalProcs.earth?.thornsDamageToAttacker > 0 && aggressor === "Avatar";
    const didThornsToFoe = elementalProcs.earth?.thornsDamageToAttacker > 0 && aggressor === "Foe";

    return (
      <HStack bgColor={aggressorIsHero ? "base.highlightMoreTransparent" : "transparent"}>
        <HStack flex={1}>
          <Text fontFamily="heading" fontSize="2xl" ml={1} mr={2}>
            {turn + 1}
          </Text>
          <Text fontSize="md" lineHeight="2xl">
            {aggressor}
          </Text>
        </HStack>
        <Box flex={1}>
          {didEvade ? (
            <Text fontFamily="handwriting" fontSize="lg" textAlign="center" lineHeight="2xl">
              Missed!
            </Text>
          ) : (
            renderAttackDamage(didCrit, attackAmount)
          )}
        </Box>
        <Box flex={1}>
          {didEvade ? (
            <Text fontFamily="handwriting" fontSize="lg" textAlign="center" color="base.air" lineHeight="2xl">
              Evaded
            </Text>
          ) : (
            <Text fontSize="md" textAlign="center" lineHeight="2xl">
              {amountBlocked}
            </Text>
          )}
        </Box>
        <Box flex={1}>
          {didHeal ? (
            <Text fontFamily="handwriting" fontSize="2xl" color="base.water" textAlign="center">
              {elementalProcs.water.amountHealed}
            </Text>
          ) : (
            <Text fontSize="md" textAlign="center" lineHeight="2xl">
              0
            </Text>
          )}
        </Box>
        <HStack justifyContent="space-around" flex={0.5}>
          {didThornsToHero ? (
            <Text fontFamily="handwriting" textAlign="center" fontSize="xl" color="base.earth">
              {aggressor === "Avatar" ? aHealthLeft : dHealthLeft}
            </Text>
          ) : (
            <Text fontSize="md" textAlign="center" lineHeight="2xl">
              {aggressor === "Avatar" ? aHealthLeft : dHealthLeft}
            </Text>
          )}
        </HStack>

        <HStack justifyContent="space-around" flex={0.5}>
          {didThornsToFoe ? (
            <Text fontFamily="handwriting" fontSize="xl" textAlign="center" color="base.earth" fontWeight="bold">
              {aggressor === "Foe" ? aHealthLeft : dHealthLeft}
            </Text>
          ) : (
            <Text fontSize="md" textAlign="center" lineHeight="2xl">
              {aggressor === "Foe" ? aHealthLeft : dHealthLeft}
            </Text>
          )}
        </HStack>
      </HStack>
    );
  }

  return (
    <View>
      <Box mt={-6} mb={2} pb={-2}>
        <Center mb={2}>
          <Text fontSize={20} color="primary.800">
            Round - By - Round
          </Text>
        </Center>
      </Box>
      <ScrollView px={1}>
        {/* TABLE */}
        <View borderBottomWidth={1} mb={5}>
          {/* HEADER */}
          <HStack bgColor="base.highlightTransparent" borderTopWidth={1} borderBottomWidth={1} pb={1}>
            <VStack space={0} flex={1}>
              <Text textAlign="center" fontFamily="heading" fontSize="lg">
                Round
              </Text>
              <Text textAlign="center" color="primary.700" fontSize="sm" mt={-1}>
                attacker
              </Text>
            </VStack>
            <VStack space={0} flex={1}>
              <Text textAlign="center" fontFamily="heading" fontSize="lg">
                Attack
              </Text>
              <Text textAlign="center" color="primary.700" fontSize="sm" mt={-1}>
                attacker
              </Text>
            </VStack>
            <VStack space={0} flex={1}>
              <Text textAlign="center" fontFamily="heading" fontSize="lg">
                Blocked
              </Text>
              <Text textAlign="center" color="primary.700" fontSize="sm" mt={-1}>
                defender
              </Text>
            </VStack>
            <VStack space={0} flex={1}>
              <Text textAlign="center" fontFamily="heading" fontSize="lg">
                Healed
              </Text>
              <Text textAlign="center" color="primary.700" fontSize="sm" mt={-1}>
                attacker
              </Text>
            </VStack>
            <VStack space={0} flex={0.5}>
              <Text textAlign="center" fontFamily="heading" fontSize="lg">
                Life
              </Text>
              <Text textAlign="center" color="primary.700" fontSize="sm" mt={-1}>
                hero
              </Text>
            </VStack>
            <VStack space={0} flex={0.5}>
              <Text textAlign="center" fontFamily="heading" fontSize="lg">
                Life
              </Text>
              <Text textAlign="center" color="primary.700" fontSize="sm" mt={-1}>
                foe
              </Text>
            </VStack>
          </HStack>
          {/* ROUNDS */}
          <FlatList data={battleReport.roundBreakdown} renderItem={({ item }) => renderRoundRow(item)} keyExtractor={(item, i) => i.toString()} />
        </View>
        {/* LEGEND */}

        <HStack justifyContent="space-between" mb={3} flexWrap="wrap">
          <Pressable onPress={() => setSelectedAttribute("fire")}>
            <HStack>
              <Icon iconName="critical_strike" size={18} color="base.fire" />
              <Text color="base.fire" fontSize="sm" fontWeight="bold" fontStyle="italic">
                Critical Strike
              </Text>
            </HStack>
          </Pressable>
          <Pressable onPress={() => setSelectedAttribute("earth")}>
            <HStack>
              <Icon iconName="thorns_damage" size={18} color="base.earth" />
              <Text color="base.earth" fontSize="sm" fontWeight="bold">
                Thorns Damage
              </Text>
            </HStack>
          </Pressable>
          <Pressable onPress={() => setSelectedAttribute("water")}>
            <HStack>
              <Icon iconName="vampiric_touch" size={18} color="base.water" />
              <Text color="base.water" fontSize="sm" fontWeight="bold">
                Vampiric Touch
              </Text>
            </HStack>
          </Pressable>
          <Pressable onPress={() => setSelectedAttribute("air")}>
            <HStack>
              <Icon iconName="evasion" size={18} color="base.air" />
              <Text color="base.air" fontSize="sm" fontStyle="italic">
                Evasion
              </Text>
            </HStack>
          </Pressable>
        </HStack>
      </ScrollView>
    </View>
  );
};

export default RoundDisplay;
