import React from "react";
import { View, Text, ScrollView, Box, VStack, HStack, FlatList } from "native-base";
import { BattleDetailOnly } from "../../../common/types-battle";
import { Subheader } from "../../../Components/CustomComponents";

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

    console.log(round);

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
      <View>
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
        <FlatList data={battleReport.roundBreakdown} renderItem={({ item }) => renderRoundRow(item)} keyExtractor={(item, i) => i.toString()} />
      </View>
    </ScrollView>
  );
};

export default RoundDisplay;
