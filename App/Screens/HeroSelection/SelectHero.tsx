import React, { useState } from "react";
import { Dimensions } from "react-native";
import { Image, Pressable, SectionList, FlatList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from "native-base";
import HeroCarousel from "../../Components/HeroCarousel";
import { ScreenContainer, Header, Subheader, ScreenActionButton, Pane, Icon } from "../../Components/CustomComponents";
import { AuthStackProps } from "../../common/types-navigator";
import { HeroChoice } from "../../common/types";

// Select Hero Screen
const SelectHero = ({ route, navigation }: AuthStackProps<"SelectHero">) => {
  const { heroList } = route.params;
  const [activeHero, setActiveHero] = useState(heroList[0]);
  console.log("HL", activeHero);

  return (
    <ScreenContainer screenName={route.name}>
      <Header text="Heroes" />

      <HeroCarousel heroList={heroList} setActiveHero={setActiveHero} viewDetails={(pressedHero: HeroChoice) => navigation.push("HeroDetails", { selectedHero: pressedHero })} />
      <Center mt={-50}>
        <Text fontFamily="heading" fontSize="3xl" color="primary.900">
          {activeHero.alias}
        </Text>
        <Text fontSize="xl" color="primary.800">
          {activeHero.description}
        </Text>
      </Center>
      <ScreenActionButton text="View Details" action={() => navigation.push("HeroDetails", { selectedHero: activeHero })} />
    </ScreenContainer>
  );
};

export default SelectHero;
