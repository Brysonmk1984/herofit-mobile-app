import React, { useEffect, useState } from "react";
import { Image, ScrollView, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, useToken } from "native-base";
import { ScreenContainer, Header, Subheader, ScreenActionButton, LoreText, Pane, StatDisplay, Icon, HelperText } from "../../Components/CustomComponents";
import { getHeroImage } from "../../common/helperFunctions";
import { AuthStackProps } from "../../common/types-navigator";
import { SelectedHero } from "../../common/types";
import { useDebounce } from "use-debounce/lib";
import { checkAvatarName } from "../../api/avatar";

// Hero Details Screen
const HeroDetails = ({ route, navigation }: AuthStackProps<"HeroDetails">) => {
  const { alias, character, description, history, elms, colors } = route.params.selectedHero;
  const { air, water, earth, fire } = elms;
  const [heroName, setHeroName] = useState(null);
  const [heroNameIsLegit, setHeroNameIsLegit] = useState(false);
  const [helperText, setHelperText] = useState(null);
  const [debouncedHeroName] = useDebounce(heroName, 500);
  const [showLore, setShowLore] = useState(false);

  function handleFinalizeHeroSelection() {
    const namedSelectedHero: SelectedHero & { name: string } = {
      name: heroName,
      character,
      air,
      water,
      earth,
      fire,
    };

    console.log("NAMED HERO", namedSelectedHero);
    return navigation.push("SpendQP", { hero: namedSelectedHero });
  }

  useEffect(() => {
    const name = debouncedHeroName;
    setHeroNameIsLegit(false);
    if (name) {
      setHelperText("Checking Availability...");
    } else {
      return setHelperText(null);
    }
    checkAvatarName({ name })
      .then(data => {
        const { availability } = data;

        if (availability) {
          if (name.length >= 3 && name.length <= 25) {
            setHelperText("Looks good!");
            setHeroNameIsLegit(true);
          } else {
            if (name.length < 3) {
              setHelperText("Hero Name must be at least 3 characters");
            } else if (name.length > 25) {
              setHelperText("Hero Name must be no more than 25 characters");
            }
            setHeroNameIsLegit(false);
          }
        } else {
          setHelperText("Hero Name is taken, please try again");
          setHeroNameIsLegit(false);
        }
      })
      .catch(error => {
        console.log("ERR", error);
        setHelperText(null);
        return debugErrors(error);
      });
  }, [debouncedHeroName]);

  useEffect(() => {
    navigation.setOptions({ title: alias });
  }, []);

  return (
    <ScreenContainer screenName={route.name} bg={colors[0]} hero={alias}>
      <Header text={alias} color={colors[1]} bgColor="base.transparent" />
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

          <Image alignSelf={"flex-end"} source={getHeroImage(character)} size={220} alt={character} />
        </HStack>
        {showLore ? (
          <Pane lore={true}>
            <LoreText lore={history} />
          </Pane>
        ) : (
          <Center mb={5}>
            <Link _text={{ fontSize: "lg" }} onPress={() => setShowLore(true)}>
              Background Story
            </Link>
          </Center>
        )}

        <Pane>
          <FormControl isRequired isInvalid={!heroNameIsLegit}>
            <Subheader text="Choose an epic hero name" fontSize="xl" />
            <Input value={heroName} onChangeText={name => setHeroName(name)} placeholder="Hero Name" shadow={1} />
          </FormControl>

          {helperText && <HelperText type={helperText === "Checking Availability..." ? "caution" : heroNameIsLegit ? "success" : "error"} text={helperText} />}
        </Pane>
      </ScrollView>
      <ScreenActionButton text="Select" disabled={!heroNameIsLegit} action={handleFinalizeHeroSelection} />
    </ScreenContainer>
  );
};

export default HeroDetails;
