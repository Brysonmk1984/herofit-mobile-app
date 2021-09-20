import React, { useState, useEffect, useRef, createRef } from "react";
import { Progress, Box, Text } from "native-base";
import { Dimensions } from "react-native";
import XpText from "./XpText";
import { useCountUp } from "use-count-up";

interface XpProgProps {
  windowWidth: number;
  xp: number;
  thisLevelStartXp: number;
  nextLevelStartXp: number;
}

const XpProg: React.FC<XpProgProps> = ({ windowWidth, xp, thisLevelStartXp, nextLevelStartXp }) => {
  const [xpGainedThisLevel, setXpGainedThisLevel] = useState(0);
  const [xpIndicator, setXpIndicator] = useState(0);
  const { value, reset } = useCountUp({ isCounting: true, duration: 0.5, easing: "easeOutCubic", end: xpIndicator });

  const levelXpRequired = nextLevelStartXp - thisLevelStartXp;

  // XP accumulated within current level
  useEffect(() => {
    const xpThisLevel = xp - thisLevelStartXp;
    setXpGainedThisLevel(xpThisLevel);
  }, []);

  // Visual percentage appearance within the gauge
  useEffect(() => {
    const xpLevelProg = (xpGainedThisLevel / nextLevelStartXp) * 100;
    setXpIndicator(xpLevelProg);
  }, [xpGainedThisLevel]);

  // Start XP Guage
  useEffect(() => {
    if (xpIndicator > 0) {
      reset();
    }
  }, [xpIndicator]);

  return (
    <Box width={windowWidth * 0.75}>
      <Progress value={value as number} mt={-0.5} colorScheme="xp" height="30px" borderRadius={25} borderWidth={2} />
      <XpText levelXp={xpGainedThisLevel} levelXpRequired={levelXpRequired} />
    </Box>
  );
};

export default XpProg;
