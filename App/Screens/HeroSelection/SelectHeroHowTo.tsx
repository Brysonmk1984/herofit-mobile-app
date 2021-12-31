import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Box, View, Text, VStack, HStack } from "native-base";
import debugErrors from "../../common/debugErrors";
import { getHeroList } from "../../api/authentication";
import { ScreenContainer, Header, Subheader, ScreenActionButton, Pane, Icon, StatDisplay } from "../../Components/CustomComponents";
import defaultStats from "../../common/defaultStats.json";
import { AuthStackProps } from "../../common/types-navigator";
import { HeroChoice } from "../../common/types";
import PaneSupportText from "../../Components/PaneSupportText";
import useGlobalToast from "../../common/hooks/useGlobalToast";

// How To Select Screen
export default function SelectHeroHowTo({ navigation, route }: AuthStackProps<"SelectHeroHowTo">) {
  // Make API call to get hero data for the next screen
  const [heroList, setHeroList] = useState<HeroChoice[] | []>([]);
  const { addToast } = useGlobalToast();

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
      <Header pt={3} pb={3} text="One More Thing" />
      <ScrollView py={3}>
        <VStack mb={30}>
          <Pane>
            <Subheader text="Base Stats" />
            <FlatList
              data={defaultStats.filter(item => item.stat !== "Aether")}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item }) => {
                return (
                  <HStack py={2} my={2} borderBottomWidth={1} borderBottomColor="primary.300">
                    <VStack flex={0.3}>
                      <Text>{item.value}</Text>
                      <Text>{item.stat}</Text>
                    </VStack>
                    <Box flex={1}>
                      <Text>{item.description}</Text>
                    </Box>
                  </HStack>
                );
              }}
            />
          </Pane>
          <Pane>
            <Box p={2}>
              <Text color="primary.700">Heroes have different starting elemental power, but these values have only a small impact. Ultimately your training and how you spend Quantum Points (Talent points) will dictate how your hero develops.</Text>
            </Box>
          </Pane>
        </VStack>
      </ScrollView>
      <ScreenActionButton text="OK" action={() => navigation.push("SelectHero", { heroList })} includeBorder={true} />
    </ScreenContainer>
  );
}
