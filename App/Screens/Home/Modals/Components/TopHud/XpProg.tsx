import React, { useState, useEffect } from "react";
import { Progress, Box } from "native-base";
import { Dimensions } from "react-native";
import XpText from "./XpText";

interface XpProgProps {
  xp: number;
  thisLevelStartXp: number;
  nextLevelStartXp: number;
}

const XpProg: React.FC<XpProgProps> = ({ xp, thisLevelStartXp, nextLevelStartXp }) => {
  const [levelXp, setLevelXp] = useState(0);
  const [xpIndicator, setXpIndicator] = useState(0);

  const windowWidth = Dimensions.get("window").width;
  useEffect(() => {
    const xpLevelProg = (thisLevelStartXp / nextLevelStartXp) * 100;
    setXpIndicator(xpLevelProg);
  }, [xp]);
  return (
    <Box width={windowWidth * 0.75}>
      <Progress value={xpIndicator} mt={-0.5} colorScheme="xp" height="30px" borderRadius={25} borderWidth={2} />;
      <XpText levelXp={thisLevelStartXp} nextLevelXp={nextLevelStartXp} />
    </Box>
  );
};

export default XpProg;
