import React, { useState, useEffect } from "react";
import { Progress, Box } from "native-base";
import { Dimensions } from "react-native";
import HealthText from "./HealthText";

interface HealthProgProps {
  health: number;
  maxHealth: number;
}

const HealthProg: React.FC<HealthProgProps> = ({ health, maxHealth }) => {
  const [healthIndicator, setHealthIndicator] = useState(0);

  const windowWidth = Dimensions.get("window").width;
  useEffect(() => {
    const healthProg = (health / maxHealth) * 100;
    setHealthIndicator(healthProg);
  }, [health, maxHealth]);
  return (
    <Box width={windowWidth * 0.85}>
      <Progress value={healthIndicator} colorScheme="health" height="50px" borderRadius={25} borderWidth={3} />
      <HealthText health={health} maxHealth={maxHealth} />
    </Box>
  );
};

export default HealthProg;
