import React, { useState, useEffect, useRef, createRef } from "react";
import { Progress, Box, Text, View } from "native-base";
import { Dimensions } from "react-native";
import XpText from "./XpText";
import { useCountUp } from "use-count-up";
import LevelText from "./LevelText";

interface XpProgProps {
  windowWidth: number;
  xp: number;
  level: number;
  albedo: number;
  thisLevelStartXp: number;
  nextLevelStartXp: number;
}

const XpProg: React.FC<XpProgProps> = ({ windowWidth, xp, level, albedo, thisLevelStartXp, nextLevelStartXp }) => {
  const [xpGainedThisLevel, setXpGainedThisLevel] = useState(0);
  const [xpIndicator, setXpIndicator] = useState(0);
  const { value, reset } = useCountUp({ isCounting: true, duration: 0.5, easing: "easeOutCubic", end: xpIndicator });

  const levelXpRequired = nextLevelStartXp - thisLevelStartXp;
  // XP accumulated within current level
  useEffect(() => {
    const xpThisLevel = xp - thisLevelStartXp < 0 ? 0 : xp - thisLevelStartXp;
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
    <Box ml={7} width={windowWidth * 0.65}>
      <Progress value={value as number} mt={-0.5} height="30px" borderRadius={25} borderWidth={2} />
      <View flexDirection="row" position="absolute" right={3} top={1.5}>
        <LevelText ml={windowWidth * 0.07} level={level} albedo={albedo} />
        <XpText levelXp={xpGainedThisLevel} levelXpRequired={levelXpRequired} />
      </View>
    </Box>
  );
};

export default XpProg;
