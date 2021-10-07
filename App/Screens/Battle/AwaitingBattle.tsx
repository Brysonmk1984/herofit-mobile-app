import React, { useContext } from "react";
import { Animated, StyleSheet, useWindowDimensions } from "react-native";
import { Box, View, Text, VStack } from "native-base";
import { GlobalStateContext } from "../../store";
import { CountdownTimer } from "../Home/Components/TopHud/CountdownTimer";
import { MainDrawerProps } from "../../common/types-navigator";
import { ScreenContainer } from "../../Components/CustomComponents";
import { PetImage } from "../Home/Components/PetImage";
import { equippedPet, equippedSkin, getFoeColor } from "../../common/helperFunctions";
import { HeroImage } from "../../Components/HeroImage/HeroImage";
import FoeImage from "../../Components/FoeImage";
import { LinearGradient } from "expo-linear-gradient";

const AwaitingBattle: React.FC<MainDrawerProps<"AwaitingBattle">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { foe } = route.params;
  const propsForHeroImage = (({ character, equipped, alias, status }) => ({ character, equipped, alias, skin: equippedSkin(equipped), status }))(state.hero);
  const vsColors = ["transparent", "#ffffff", "#ffffff", "transparent"];
  const heroColors = [state.hero.colors[0], "#ffffff"];
  const foeColors = ["#ffffff", getFoeColor(foe.type)];
  const { width, height } = useWindowDimensions();

  // upcomingRewards={upcomingRewards}
  // handleItemClick={handleItemClick}
  // runBattleNow={runBattleNow}
  console.log("HERO", state.hero);

  return (
    <ScreenContainer screenName={route.name}>
      <Box flex={1}>
        <LinearGradient end={{ x: 0.5, y: 1 }} colors={heroColors} style={styles.heroGradient} />
        {/* <Animated.View style={{ transform: [{ translateX: 0 }] }}> */}
        <Box position="absolute" left={-20} top={-15}>
          <HeroImage width={height * 0.45} height={height * 0.45} {...propsForHeroImage} />
        </Box>
        {/* </Animated.View> */}
      </Box>
      <Box w="100%" flex={1}>
        <LinearGradient end={{ x: 1, y: 0.5 }} colors={foeColors} style={styles.foeGradient} />
        <Box position="absolute" right={-10} bottom={-15}>
          <FoeImage width={height * 0.45} height={height * 0.45} foeType={foe.type} heroCharacterName={foe.type === "Shadow Self" ? state.hero.character : null} />
        </Box>
      </Box>
      <VStack h={height * 0.45} w="100%" justifyContent="center" alignItems="center" position="absolute" top={height * 0.25}>
        <LinearGradient colors={vsColors} style={styles.vsGradient} />
        <Text mt={-10} mb={-35} fontSize={100} fontFamily="heading">
          VS
        </Text>
        <CountdownTimer hideType={true} type={"Battle"} />
      </VStack>
    </ScreenContainer>
  );
};

export default AwaitingBattle;

const styles = StyleSheet.create({
  vsGradient: { height: "100%", width: "100%", position: "absolute" },
  foeGradient: { height: "100%", width: "100%" },
  heroGradient: { height: "100%", width: "100%" },
});
