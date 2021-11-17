import React, { useState, useEffect } from "react";
import { Progress, Box, View } from "native-base";
import XpText from "./XpText";
import { useCountUp } from "use-count-up";
import LevelText from "./LevelText";
import usePrevious from "../../../../common/hooks/usePrevious";

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
  const prevXpGained = usePrevious(xpGainedThisLevel);
  const prevXpIndicator = usePrevious(xpIndicator);

  const { value, reset } = useCountUp({ start: prevXpIndicator, isCounting: true, duration: 5, easing: "easeOutCubic", end: xpIndicator });

  const levelXpRequired = nextLevelStartXp - thisLevelStartXp;
  // XP accumulated within current level
  useEffect(() => {
    const xpThisLevel = xp - thisLevelStartXp < 0 ? 0 : xp - thisLevelStartXp;
    setXpGainedThisLevel(xpThisLevel);
  }, [xp]);

  // Visual percentage appearance within the gauge
  useEffect(() => {
    const xpLevelProg = (xpGainedThisLevel / (nextLevelStartXp - thisLevelStartXp)) * 100;
    setXpIndicator(xpLevelProg);
  }, [xpGainedThisLevel]);

  // Start XP Guage
  useEffect(() => {
    if (xpIndicator > 0) {
      reset();
    }
  }, [xpIndicator]);

  return (
    <Box ml={4} width={windowWidth * 0.7}>
      <Progress value={value as number} colorScheme="xp" mt={-0.5} height="40px" borderRadius={25} borderWidth={2} />
      <View flexDirection="row" position="absolute" right={2} top={1.5}>
        <LevelText ml={windowWidth * 0.05} level={level} albedo={albedo} />
        <XpText levelXp={xpGainedThisLevel} levelXpRequired={levelXpRequired} prevXpGained={prevXpGained} />
      </View>
    </Box>
  );
};

export default XpProg;
