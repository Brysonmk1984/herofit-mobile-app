import React, { useEffect } from "react";
import { Image, ScrollView, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, useToken } from "native-base";
import { ScreenContainer, Header, Subheader, ScreenActionButton, LoreText, Pane, StatDisplay, Icon } from "../../Components/CustomComponents";
import { getHeroImage } from "../../common/helperFunctions";
import { AuthStackProps } from "../../common/types-navigator";

// Hero Details Screen
const HeroDetails = ({ route, navigation }: AuthStackProps<"HeroDetails">) => {
  const { alias, character, description, history, elms, colors } = route.params.selectedHero;
  const { air, water, earth, fire } = elms;

  function handleFinalizeHeroSelection() {
    const selectedHero = { character, air, water, earth, fire };
    navigation.push("FinalizeHeroSelection", { selectedHero, alias, colors });
  }

  useEffect(() => {
    navigation.setOptions({ title: alias });
  }, []);

  return (
    <ScreenContainer screenName={route.name} bg={colors[0]} hero={alias}>
      <Header text={alias} color={colors[1]} />
      <ScrollView mt={-3} mb={5}>
        <HStack mb={3} justifyContent={"space-between"}>
          <Pane mb={5}>
            <VStack mt={-3} mb={-3} space={1}>
              <StatDisplay stat="Fire" value={fire} size="sm" />
              <Divider variant="statDivider" />
              <StatDisplay stat="Earth" value={earth} size="sm" />
              <Divider variant="statDivider" />
              <StatDisplay stat="Water" value={water} size="sm" />
              <Divider variant="statDivider" />
              <StatDisplay stat="Air" value={air} size="sm" />
            </VStack>
          </Pane>

          <Image alignSelf={"flex-end"} source={getHeroImage(character)} size={220} alt={alias} />
        </HStack>
        <Pane lore={true}>
          <LoreText lore={history} />
        </Pane>
      </ScrollView>
      <ScreenActionButton name="Select" action={handleFinalizeHeroSelection} />
    </ScreenContainer>
  );
};

export default HeroDetails;
