import React, { useContext, useEffect, useState } from "react";
import { Image, ScrollView, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, useToken } from "native-base";
import { ScreenContainer, Header, Subheader, ScreenActionButton, LoreText, Pane, StatDisplay, Icon, HelperText } from "../../../Components/CustomComponents";
import { getHeroImage } from "../../../common/helperFunctions";
import { AuthStackProps } from "../../../common/types-navigator";
import { SelectedHero } from "../../../common/types";
import { useDebounce } from "use-debounce/lib";
import { checkAvatarName } from "../../../api/avatar";
import { DetailModal } from "../../../Components/ModalTemplates/ModalTemplates";
import useModal from "../../../common/hooks/useModal";
import { GlobalStateContext } from "../../../store";
import HeroDescription from "./Modals/HeroDescription";
import AttributeDetail from "../../../Components/Modals/AttributeDetail";
import KeyboardScrollView from "../../../Components/KeyboardScrollView";
import debugErrors from "../../../common/debugErrors";

// Hero Details Screen
const HeroDetails = ({ route, navigation }: AuthStackProps<"HeroDetails">) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { alias, character, description, history, elms, colors } = route.params.selectedHero;
  const { air, water, earth, fire } = elms;
  const [heroName, setHeroName] = useState(null);
  const [heroNameIsLegit, setHeroNameIsLegit] = useState(false);
  const [helperText, setHelperText] = useState(null);
  const [debouncedHeroName] = useDebounce(heroName, 500);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const { openModal } = useModal();
  const darkBackgrounds = ["Chrono Guy", "Empath", "Natural Ninja", "Timber Terror", "Wildspeaker"];

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
    if (selectedAttribute) {
      openModal("AttributeDetail");
    }
  }, [selectedAttribute]);

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

  return (
    <ScreenContainer screenName={route.name} bg={colors[0]} hero={alias}>
      <KeyboardScrollView extraScroll={150}>
        <Header text={alias} color={colors[1]} bgColor="base.transparent" />

        <HStack mb={0} justifyContent={"space-between"}>
          <Pane variant="transparent" mb={5}>
            <VStack mt={-3} mb={-3} space={0}>
              <Pressable onPress={() => setSelectedAttribute("fire")}>
                <StatDisplay stat="Fire" value={fire} size="lg" reversedText={darkBackgrounds.includes(alias)} />
              </Pressable>
              <Pressable onPress={() => setSelectedAttribute("earth")}>
                <StatDisplay stat="Earth" value={earth} size="lg" reverseOrder={true} reversedText={darkBackgrounds.includes(alias)} />
              </Pressable>
              <Pressable onPress={() => setSelectedAttribute("water")}>
                <StatDisplay stat="Water" value={water} size="lg" reversedText={darkBackgrounds.includes(alias)} />
              </Pressable>
              <Pressable onPress={() => setSelectedAttribute("air")}>
                <StatDisplay stat="Air" value={air} size="lg" reverseOrder={true} reversedText={darkBackgrounds.includes(alias)} />
              </Pressable>
            </VStack>
          </Pane>
          <Box>
            <Image zIndex={1} alignSelf={"flex-end"} source={getHeroImage(character)} size={220} alt={character} />
            <Image position="absolute" left="50%" top="50%" ml={-120} mt={-180} zIndex={0} size={350} source={require("../../../../assets/images/misc/radial-glow.webp")} resizeMode="contain" />
            <Center>
              <Link _text={{ fontSize: "lg" }} onPress={() => openModal("HeroDescription")}>
                Background Story
              </Link>
            </Center>
          </Box>
        </HStack>

        <Pane variant="transparent">
          <Input value={heroName} onChangeText={name => setHeroName(name)} placeholder="What's Your Hero Name?" shadow={1} />

          {helperText && <HelperText type={helperText === "Checking Availability..." ? "caution" : heroNameIsLegit ? "success" : "error"} text={helperText} reversed={true} />}
        </Pane>

        <ScreenActionButton text="Select" disabled={!heroNameIsLegit} action={handleFinalizeHeroSelection} />
        {state.modalQueue[0] === "HeroDescription" && <HeroDescription id="HeroDescription" character={route.params.selectedHero} />}
        {selectedAttribute && <AttributeDetail id="AttributeDetail" attribute={selectedAttribute} />}
      </KeyboardScrollView>
    </ScreenContainer>
  );
};

export default HeroDetails;
