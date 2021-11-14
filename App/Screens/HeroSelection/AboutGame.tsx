import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Box, View, Text, VStack, HStack, Heading, Divider } from "native-base";
import { ScreenContainer, Header, Subheader, ScreenActionButton, Pane, Icon } from "../../Components/CustomComponents";
import aboutActivities from "../../common/aboutActivities.json";
import { AuthStackProps } from "../../common/types-navigator";

// How To Select Screen
export default function AboutGame({ navigation, route }: AuthStackProps<"AboutGame">) {
  function renderHeader(stat: string, lcStat: string) {
    return (
      <Heading>
        <Text fontFamily="heading" fontSize="2xl" color={`base.${lcStat}`}>
          {stat} Activities:
        </Text>
      </Heading>
    );
  }

  interface ElementDetails {
    description: string;
    trait: string;
  }

  function renderDescription(name: string, elementDetails: ElementDetails) {
    const { description, trait } = elementDetails;
    return name === "Other" ? (
      <View flex={2}>
        <Text>{description}</Text>
      </View>
    ) : (
      <View flex={2}>
        <Box>
          <Text mt={3} fontSize="lg" fontFamily="heading">
            Earned From:
          </Text>
          <Text color="primary.700">{description}</Text>
        </Box>
        {trait && (
          <HStack mt={3} space={2}>
            <Text fontSize="lg" fontFamily="heading">
              Battle Effect:
            </Text>
            <Text fontSize="lg" color={`base.${name}`} fontFamily="heading">
              {trait}
            </Text>
          </HStack>
        )}
      </View>
    );
  }

  function renderIcon(lcStat) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Icon iconName={lcStat} size={85} color={`base.${lcStat}`} />
      </View>
    );
  }

  return (
    <ScreenContainer screenName={route.name}>
      <Header text="The Game" />
      <ScrollView py={3}>
        <VStack mb={30}>
          <Pane>
            <Subheader text="A Fitness Tracking RPG" />
            <Box px={2}>
              <Text color="primary.700">HeroFit is an ongoing, cumulative fitness tracking game. Exercise in the 3D, then open the app to level up your Hero and battle the Dark Forces! To Play, all you need is a few minutes per day.</Text>
            </Box>
          </Pane>
          <Pane>
            <Subheader text="How To Play" />
            <VStack px={2} space={1}>
              <HStack alignItems="center">
                <Box pr={2}>
                  <Text fontSize="lg">1.</Text>
                </Box>
                <Text color="primary.700">Complete any physical activity</Text>
              </HStack>
              <HStack alignItems="center">
                <Box pr={2}>
                  <Text fontSize="lg">2.</Text>
                </Box>
                <Text color="primary.700">Log activity in HeroFit or allow Strava to pull your data</Text>
              </HStack>

              <HStack alignItems="center">
                <Box pr={2}>
                  <Text fontSize="lg">3.</Text>
                </Box>
                <Text color="primary.700">Go To Battle once per day</Text>
              </HStack>

              <HStack alignItems="center">
                <Box pr={2}>
                  <Text fontSize="lg">4.</Text>
                </Box>
                <Text color="primary.700">Level up, spend stat points & grow stronger</Text>
              </HStack>

              <HStack alignItems="center">
                <Box pr={2}>
                  <Text fontSize="lg">5.</Text>
                </Box>
                <Text color="primary.700">Collect Photon Tokens, buy items & pets</Text>
              </HStack>
            </VStack>
          </Pane>

          <Pane>
            <Subheader text="Activities Matter" />
            <VStack space={6}>
              <Box pb={7} borderBottomWidth={1} borderBottomColor="primary.50">
                <Text textAlign="center" fontFamily="heading" fontSize="3xl" color="base.fire">
                  FIRE
                </Text>
                <HStack p={2} space={2} alignItems="center" justifyContent="center">
                  {renderDescription("fire", aboutActivities.fire)}
                  {renderIcon("fire")}
                </HStack>
              </Box>
              <Box pb={7} borderBottomWidth={1} borderBottomColor="primary.50">
                <Text textAlign="center" fontFamily="heading" fontSize="3xl" color="base.earth">
                  EARTH
                </Text>
                <HStack space={2} alignItems="center" justifyContent="center">
                  {renderDescription("earth", aboutActivities.earth)}
                  {renderIcon("earth")}
                </HStack>
              </Box>
              <Box pb={7} borderBottomWidth={1} borderBottomColor="primary.50">
                <Text textAlign="center" fontFamily="heading" fontSize="3xl" color="base.water">
                  WATER
                </Text>
                <HStack space={2} alignItems="center" justifyContent="center">
                  {renderDescription("water", aboutActivities.water)}
                  {renderIcon("water")}
                </HStack>
              </Box>
              <Box pb={7} borderBottomWidth={1} borderBottomColor="primary.50">
                <Text textAlign="center" fontFamily="heading" fontSize="3xl" color="base.air">
                  AIR
                </Text>
                <HStack space={2} alignItems="center" justifyContent="center">
                  {renderDescription("air", aboutActivities.air)}
                  {renderIcon("air")}
                </HStack>
              </Box>
              <Box>
                <Text textAlign="center" fontFamily="heading" fontSize="3xl" color="primary.600">
                  OTHER
                </Text>
                <HStack space={2} alignItems="center" justifyContent="center">
                  {renderDescription("other", aboutActivities.other)}
                  {renderIcon("other")}
                </HStack>
              </Box>
            </VStack>
          </Pane>
        </VStack>
      </ScrollView>

      <ScreenActionButton text="OK" action={() => navigation.push("SelectHeroHowTo")} includeBorder={true} />
    </ScreenContainer>
  );
}
