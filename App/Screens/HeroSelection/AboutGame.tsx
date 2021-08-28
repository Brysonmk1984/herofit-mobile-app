import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Box, View, Text, VStack, HStack, Heading, Divider } from "native-base";
import debugErrors from "../../common/debugErrors";
import { getHeroList } from "../../api/authentication";
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

  function renderDescription({ stat, description, trait }: { stat: string; description: string; trait: string }, lcStat: string) {
    return stat === "Other" ? (
      <View flex={2}>
        <Text>{description}</Text>
      </View>
    ) : (
      <View flex={2}>
        <Text fontWeight="bold">Battle Effect:</Text>
        <Text color={`base.${lcStat}`} fontWeight="normal">
          {trait}
        </Text>
        <Text mt={3} fontWeight="bold">
          Earned From:
        </Text>
        <Text>{description}</Text>
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
    // Fetch list of Heroes from server so it's ready for the next screen
    getHeroList()
      .then(data => {
        setHeroList(data);
      })
      .catch(error => {
        return debugErrors(error);
      });
  }, []);

  return (
    <ScreenContainer screenName={route.name}>
      <ScrollView mb={5}>
        <Header mb={3} text="The Game" />
        <VStack mb={3}>
          <Pane>
            <Text textAlign="justify" fontSize="sm">
              Track your exercises in the real world, level up your Hero in game! Exercise to make them stronger and overcome The Dark Forces!
            </Text>
          </Pane>
          <Pane>
            <Subheader text="Things To Do" />
            <VStack space={1}>
              <Text>1. Exercise, Empower hero with latest activities</Text>
              <Text>2. Go To Battle once per day</Text>
              <Text>3. Level up, spend stat points & grow stronger</Text>
              <Text>4. Collect Photon Tokens, buy items & pets</Text>
            </VStack>
          </Pane>
          <Pane>
            <Subheader text="Activities Matter" />
            <FlatList
              data={aboutActivities}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item }) => {
                const lcStat = item.stat.toLowerCase();

                return (
                  <Box display="flex">
                    {renderHeader(item.stat, lcStat)}
                    <HStack space={2} alignItems="center" justifyContent="center">
                      {renderDescription(item, lcStat)}
                      {renderIcon(lcStat)}
                    </HStack>
                    <Divider my={3} bgColor="primary.400" />
                  </Box>
                );
              }}
            />
          </Pane>
        </VStack>
      </ScrollView>
      <ScreenActionButton name="OK" action={() => navigation.push("SelectHeroHowTo")} />
    </ScreenContainer>
  );
}
