import React from "react";
import { View, Text, ScrollView, Box, VStack, HStack, FlatList } from "native-base";
import { BattleDetailOnly } from "../../../common/types-battle";
import { Icon, Subheader } from "../../../Components/CustomComponents";

interface RoundDisplayProps {
  battleReport: BattleDetailOnly;
}

const RoundDisplay: React.FC<RoundDisplayProps> = ({ battleReport }) => {
  function renderAttackDamage(didCrit: boolean, damage: number) {
    return didCrit ? (
      <Text fontSize="xl" color="base.fire" fontWeight="bold" textAlign="center">
        {damage}
      </Text>
    ) : (
      <Text textAlign="center">{damage}</Text>
    );
  }

  function renderRoundRow(round) {
    const { turn, aggressor, defender, elementalDamageDealt, physicalDamageDealt, physicalReduction, elementalReduction, elementalProcs, aggressorHealthLeft, defenderHealthLeft } = round;
    const amountBlocked = physicalReduction + elementalReduction.total;
    const attackAmount = physicalDamageDealt + elementalDamageDealt.total + amountBlocked;

    const didEvade = elementalProcs.air?.evaded ?? false;
    const didCrit = elementalProcs.fire?.critDamage > 0;
    const didHeal = elementalProcs.water?.amountHealed > 0;
    const didThornsToHero = elementalProcs.earth?.thornsDamageToAttacker > 0 && aggressor === "Avatar";
    const didThornsToFoe = elementalProcs.earth?.thornsDamageToAttacker > 0 && aggressor === "Foe";

    return (
      <HStack>
        <HStack flex={1}>
          <Text fontFamily="heading" fontSize="xl" mt={1} mr={3}>
            {turn + 1}
          </Text>
          <Text>{aggressor}</Text>
        </HStack>
        <Box flex={1}>
          {didEvade ? (
            <Text fontStyle="italic" fontSize="sm" pt={1} textAlign="center">
              Missed!
            </Text>
          ) : (
            renderAttackDamage(didCrit, attackAmount)
          )}
        </Box>
        <Box flex={1}>
          {didEvade ? (
            <Text textAlign="center" fontStyle="italic" color="base.air">
              Evaded
            </Text>
          ) : (
            <Text textAlign="center">{amountBlocked}</Text>
          )}
        </Box>
        <Box flex={1}>
          {didHeal ? (
            <Text color="base.water" fontWeight="bold" mt={0.5} textAlign="center">
              {elementalProcs.water.amountHealed}
            </Text>
          ) : (
            <Text textAlign="center">{0}</Text>
          )}
        </Box>
        <HStack justifyContent="space-around" flex={1.1}>
          {didThornsToHero ? (
            <Text textAlign="center" color="base.earth" fontWeight="bold" mt={0.5}>
              {aggressor === "Avatar" ? aggressorHealthLeft : defenderHealthLeft}
            </Text>
          ) : (
            <Text textAlign="center">{aggressor === "Avatar" ? aggressorHealthLeft : defenderHealthLeft}</Text>
          )}

          {didThornsToFoe ? (
            <Text textAlign="center" color="base.earth" fontWeight="bold" mt={0.5}>
              {aggressor === "Foe" ? aggressorHealthLeft : defenderHealthLeft}
            </Text>
          ) : (
            <Text textAlign="center">{aggressor === "Foe" ? aggressorHealthLeft : defenderHealthLeft}</Text>
          )}
        </HStack>
      </HStack>
    );
  }

  return (
    <ScrollView px={1}>
      <Box px={5}>
        <Subheader dividerColor="base.primary" text="Round - By - Round" />
      </Box>
      {/* TABLE */}
      <View borderBottomWidth={1} pb={5} mb={5}>
        {/* HEADER */}
        <HStack>
          <VStack space={0.2} flex={1}>
            <Text textAlign="center" fontFamily="heading">
              Round
            </Text>
            <Text textAlign="center" color="primary.600" fontSize="sm">
              attacker
            </Text>
          </VStack>
          <VStack space={0.2} flex={1}>
            <Text textAlign="center" fontFamily="heading">
              Attack
            </Text>
            <Text textAlign="center" color="primary.600" fontSize="sm">
              attacker
            </Text>
          </VStack>
          <VStack space={0.2} flex={1}>
            <Text textAlign="center" fontFamily="heading">
              Blocked
            </Text>
            <Text textAlign="center" color="primary.600" fontSize="sm">
              defender
            </Text>
          </VStack>
          <VStack space={0.2} flex={1}>
            <Text textAlign="center" fontFamily="heading">
              Healed
            </Text>
            <Text textAlign="center" color="primary.600" fontSize="sm">
              attacker
            </Text>
          </VStack>
          <VStack space={0.2} flex={1.1}>
            <Text textAlign="center" fontFamily="heading">
              Health
            </Text>
            <Text textAlign="center" color="primary.600" fontSize="sm">
              hero / foe
            </Text>
          </VStack>
        </HStack>
        {/* ROUNDS */}
        <FlatList data={battleReport.roundBreakdown} renderItem={({ item }) => renderRoundRow(item)} keyExtractor={(item, i) => i.toString()} />
      </View>
      {/* LEGEND */}
      <Box>
        <Text textAlign="center" fontFamily="heading" fontSize="lg" mb={3}>
          Elemental Effects
        </Text>
        <HStack mb={3}>
          <HStack justifyContent="flex-start" flex={1}>
            <Icon iconName="fire" size={25} color="base.fire" />
            <Text color="base.fire" mr={2} fontSize="lg">
              Critical Strike
            </Text>
            <Icon iconName="critical_strike" size={25} color="base.fire" />
          </HStack>
          <HStack flex={1}>
            <Icon iconName="earth" size={25} color="base.earth" />

            <Text color="base.earth" ml={2} fontSize="lg">
              Thorns Damage
            </Text>
            <Icon iconName="thorns_damage" size={25} color="base.earth" />
          </HStack>
        </HStack>
        <HStack>
          <HStack justifyContent="flex-start" flex={1}>
            <Icon iconName="water" size={25} color="base.water" />
            <Text color="base.water" mt={-1} mr={2} fontSize="lg">
              Vampiric Touch
            </Text>
            <Icon iconName="vampiric_touch" size={25} color="base.water" />
          </HStack>
          <HStack flex={1}>
            <Icon iconName="air" size={25} color="base.air" />
            <Text color="base.air" mt={-1} ml={2} fontSize="lg">
              Evasion
            </Text>
            <Icon iconName="evasion" size={25} color="base.air" />
          </HStack>
        </HStack>
      </Box>
    </ScrollView>
  );
};

export default RoundDisplay;
