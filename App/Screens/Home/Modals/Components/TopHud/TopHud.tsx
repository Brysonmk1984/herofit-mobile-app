import React, { useEffect, useState } from "react";
import { Progress, Box } from "native-base";
import XpProg from "./XpProg";
import HealthProg from "./HealthProg";
import { Dimensions } from "react-native";

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
  healthObj: HealthProperties;
  xpObj: XpProperties;
}

export const TopHud: React.FC<TopHudProps> = ({ healthObj, xpObj }) => {
  const windowWidth = Dimensions.get("window").width;

  return (
    <Box mt={3}>
      <HealthProg windowWidth={windowWidth} {...healthObj} />
      <XpProg windowWidth={windowWidth} {...xpObj} />
    </Box>
  );
};
