import React, { useEffect, useState } from "react";
import { Progress, Box } from "native-base";
import XpProg from "./XpProg";
import HealthProg from "./HealthProg";

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
  return (
    <Box mt={3}>
      <HealthProg {...healthObj} />
      <XpProg {...xpObj} />
    </Box>
  );
};
