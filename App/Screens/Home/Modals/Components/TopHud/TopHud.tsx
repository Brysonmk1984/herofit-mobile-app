import React, { useEffect, useState } from "react";
import { Progress, Box, Image, View, Text } from "native-base";
import XpProg from "./XpProg";
import HealthProg from "./HealthProg";
import { Dimensions } from "react-native";
import HeroTitle from "./HeroTitle";
import { CountdownTimer } from "../HeroDetails/CountdownTimer";
import StatusBar from "./StatusBar";
import { PtContainer } from "./PtContainer";

interface HealthProperties {
  health: number;
  maxHealth: number;
}

interface XpProperties {
  xp: number;
  thisLevelStartXp: number;
  nextLevelStartXp: number;
}

interface TopHudProps {
  name: string;
  level: number;
  albedo: number;
  healthObj: HealthProperties;
  xpObj: XpProperties;
  status: string;
  goToBattle: boolean;
  photonTokens: number;
  title?: string;
}

export const TopHud: React.FC<TopHudProps> = ({ healthObj, xpObj, name, level, albedo, status, goToBattle, photonTokens, title }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  return (
    <Box mt={10}>
      {/* <Box style={{ transform: [{ rotate: "80deg" }] }} w={windowWidth * 0.35} h={windowWidth * 0.5} position="absolute" left={-20} top={-20} bgColor="base.primary"></Box> */}
      {/* <Box style={{ transform: [{ rotate: "45deg" }] }} w={windowWidth * 0.5} h={windowHeight * 0.5} position="absolute" left={-49} top={-140} bgColor="base.primary"></Box> */}

      {/* LOGO */}
      <Box position="absolute" left={-1} top={-36} zIndex={100} elevation={100}>
        <Image size={windowWidth * 0.28} source={require("../../../../../../assets/images/misc/HF-logo.webp")} alt="HeroFit Logo" />
      </Box>
      <View ml={6}>
        {title && <HeroTitle title={title} />}
        <HealthProg name={name} windowWidth={windowWidth} {...healthObj} />
        <XpProg level={level} albedo={albedo} windowWidth={windowWidth} {...xpObj} />
      </View>
      <StatusBar windowWidth={windowWidth}>
        <Box justifyContent="center" flexDirection="row">
          {status === "Knocked Out" ? (
            <CountdownTimer type={"Knocked Out"} />
          ) : goToBattle ? (
            <CountdownTimer type={"Battle"} />
          ) : (
            <Box flexDirection="row" mt={1}>
              <Text fontSize={20} fontFamily="heading" color="base.white" opacity=".5">
                Status:
              </Text>
              <Text ml={2} fontSize={20} fontFamily="heading" color="base.highlight">
                {status}
              </Text>
            </Box>
          )}
        </Box>
      </StatusBar>
      <PtContainer photonTokens={photonTokens} />
    </Box>
  );
};
