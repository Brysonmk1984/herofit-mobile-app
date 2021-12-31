import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Box, View, Text, VStack, HStack, Heading, Divider, Pressable } from "native-base";
import { ScreenContainer, Header, Subheader, ScreenActionButton, Pane, Icon } from "../../Components/CustomComponents";
import aboutActivities from "../../common/aboutActivities.json";
import { AuthStackProps } from "../../common/types-navigator";
import { getHeroList } from "../../api/authentication";
import debugErrors from "../../common/debugErrors";
import PaneSupportText from "../../Components/PaneSupportText";
import AttributeDetail from "../../Components/Modals/AttributeDetail";
import useModal from "../../common/hooks/useModal";
import useGlobalToast from "../../common/hooks/useGlobalToast";

// How To Select Screen
export default function AboutGame({ navigation, route }: AuthStackProps<"AboutGame">) {
  // Make API call to get hero data for the next screen
  const [heroList, setHeroList] = useState<HeroChoice[] | []>([]);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const { addToast } = useGlobalToast();
  const { openModal } = useModal();
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

  useEffect(() => {
    if (selectedAttribute) {
      openModal("AttributeDetail");
    }
  }, [selectedAttribute]);

  useEffect(() => {
    // Fetch list of Heroes from server so it's ready for the next screen
    getHeroList()
      .then(data => {
        setHeroList(data);
      })
      .catch(error => {
        addToast("error", "There was a problem fetching game data, please try again later", 5000);
        return debugErrors(error);
      });
  }, []);

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
              <Pressable onPress={() => setSelectedAttribute("fire")}>
                <Box pb={7} borderBottomWidth={1} borderBottomColor="primary.50">
                  <Text textAlign="center" fontFamily="heading" fontSize="3xl" color="base.fire">
                    FIRE
                  </Text>

                  <HStack p={2} space={2} alignItems="center" justifyContent="center">
                    {renderDescription("fire", aboutActivities.fire)}
                    {renderIcon("fire")}
                  </HStack>
                </Box>
              </Pressable>
              <Pressable onPress={() => setSelectedAttribute("earth")}>
                <Box pb={7} borderBottomWidth={1} borderBottomColor="primary.50">
                  <Text textAlign="center" fontFamily="heading" fontSize="3xl" color="base.earth">
                    EARTH
                  </Text>
                  <HStack space={2} alignItems="center" justifyContent="center">
                    {renderDescription("earth", aboutActivities.earth)}
                    {renderIcon("earth")}
                  </HStack>
                </Box>
              </Pressable>
              <Pressable onPress={() => setSelectedAttribute("water")}>
                <Box pb={7} borderBottomWidth={1} borderBottomColor="primary.50">
                  <Text textAlign="center" fontFamily="heading" fontSize="3xl" color="base.water">
                    WATER
                  </Text>
                  <HStack space={2} alignItems="center" justifyContent="center">
                    {renderDescription("water", aboutActivities.water)}
                    {renderIcon("water")}
                  </HStack>
                </Box>
              </Pressable>
              <Pressable onPress={() => setSelectedAttribute("air")}>
                <Box pb={7} borderBottomWidth={1} borderBottomColor="primary.50">
                  <Text textAlign="center" fontFamily="heading" fontSize="3xl" color="base.air">
                    AIR
                  </Text>
                  <HStack space={2} alignItems="center" justifyContent="center">
                    {renderDescription("air", aboutActivities.air)}
                    {renderIcon("air")}
                  </HStack>
                </Box>
              </Pressable>

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

          <Pane>
            <PaneSupportText iconName="info" iconColor="base.info" text="Heroes have different elemental power">
              but these values have only a small impact. Ultimately your training and how you spend Quantum Points (Talent points) will dictate how your hero develops.
            </PaneSupportText>
          </Pane>
        </VStack>
      </ScrollView>

      <ScreenActionButton disabled={heroList.length === 0} text="OK" action={() => navigation.push("SelectHero", { heroList })} />
      {selectedAttribute && <AttributeDetail id="AttributeDetail" attribute={selectedAttribute} />}
    </ScreenContainer>
  );
}
