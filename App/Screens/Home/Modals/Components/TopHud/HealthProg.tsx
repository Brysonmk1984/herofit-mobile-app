import React, { useState, useEffect } from "react";
import { Progress, Box } from "native-base";
import { Dimensions } from "react-native";
import HealthText from "./HealthText";
import { useCountUp } from "use-count-up";

interface HealthProgProps {
  windowWidth: number;
  health: number;
  maxHealth: number;
}

const HealthProg: React.FC<HealthProgProps> = ({ windowWidth, health, maxHealth }) => {
  const [healthIndicator, setHealthIndicator] = useState(0);
  const { value, reset } = useCountUp({ isCounting: true, duration: 1, easing: "easeOutCubic", end: healthIndicator });

  // Visual percentage appearance within the gauge
  useEffect(() => {
    const healthProg = (health / maxHealth) * 100;
    setHealthIndicator(healthProg);
  }, [health, maxHealth]);

  // Start XP Gauge
  useEffect(() => {
    if (healthIndicator > 0) {
      reset();
    }
  }, [healthIndicator]);

  return (
    <Box width={windowWidth * 0.85}>
      <Progress value={value as number} colorScheme="health" height="50px" borderRadius={25} borderWidth={3} />
      <HealthText health={health} maxHealth={maxHealth} />
    </Box>
  );
};

export default HealthProg;
