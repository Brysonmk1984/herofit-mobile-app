import React, { useContext } from "react";
import { Box, Image, View, Text } from "native-base";
import XpProg from "./XpProg";
import HealthProg from "./HealthProg";
import { Dimensions } from "react-native";
import HeroTitle from "./HeroTitle";
import { CountdownTimer } from "../HeroDetails/CountdownTimer";
import StatusBar from "./StatusBar";
import { DefaultHeroProperties, Hero, HeroWithStats, Item } from "../../../../../common/types";
import { equippedTitle } from "../../../../../common/helperFunctions";
import { GlobalStateContext } from "../../../../../store";
import { isExistingHero } from "../../../../../common/typeGuards";

// interface HealthProperties {
//   health: number;
//   maxHealth: number;
// }

// interface XpProperties {
//   xp: number;
//   thisLevelStartXp: number;
//   nextLevelStartXp: number;
// }

// interface TopHudProps {
//   name: string;
//   level: number;
//   albedo: number;
//   healthObj: HealthProperties;
//   xpObj: XpProperties;
//   status: string;
//   goToBattle: boolean;
//   photonTokens: number;
//   title?: Item;
// }

export const TopHud: React.FC<TopHudProps> = () => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const hero = state.hero;
  const windowWidth = Dimensions.get("window").width;

  return (
    <Box mt={41}>
      {/* LOGO */}
      <Box position="absolute" left={-10} top={-41} zIndex={100} elevation={100}>
        <Image size={windowWidth * 0.32} source={require("../../../../../../assets/images/misc/hf-logo.webp")} alt="HeroFit Logo" />
      </Box>
      <View ml={8} mt={0}>
        <HeroTitle title={hero.equipped.find(i => i.type === "title")} />
        <HealthProg name={hero.name} windowWidth={windowWidth} health={hero.health} maxHealth={hero.maxHealth} />
        <XpProg level={hero.level} albedo={hero.albedo} windowWidth={windowWidth} xp={hero.activityXP + hero.battleXP} thisLevelStartXp={hero.thisLevelStartXp} nextLevelStartXp={hero.nextLevelStartXp} />
      </View>
      <StatusBar windowWidth={windowWidth}>
        <Box justifyContent="center" flexDirection="row">
          {hero.status === "Knocked Out" ? (
            <CountdownTimer type={"Knocked Out"} />
          ) : hero.goToBattle ? (
            <CountdownTimer type={"Battle"} />
          ) : (
            <Box flexDirection="row" mt={1}>
              <Text fontSize={20} fontFamily="heading" color="base.white" opacity=".5">
                Status:
              </Text>
              <Text ml={2} fontSize={20} fontFamily="heading" color="base.highlight">
                {hero.status}
              </Text>
            </Box>
          )}
        </Box>
      </StatusBar>
    </Box>
  );
};
