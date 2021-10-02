import React, { useState, useEffect } from "react";
import { Progress, Box, View } from "native-base";
import { Dimensions } from "react-native";
import HealthText from "./HealthText";
import { useCountUp } from "use-count-up";
import NameText from "./NameText";
import usePrevious from "../../../../../common/hooks/usePrevious";

interface HealthProgProps {
  windowWidth: number;
  health: number;
  maxHealth: number;
  name: string;
}

const HealthProg: React.FC<HealthProgProps> = ({ name, windowWidth, health, maxHealth }) => {
  const [healthIndicator, setHealthIndicator] = useState(0);
  const prevHealthIndicator = usePrevious(healthIndicator);
  const { value, reset } = useCountUp({ start: prevHealthIndicator, isCounting: true, duration: 1, easing: "easeOutCubic", end: healthIndicator });

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
    <Box width={windowWidth * 0.8}>
      <Progress value={value as number} colorScheme="health" height="50px" borderRadius={25} borderWidth={3} />
      <View flexDirection="row" position="absolute" right={4} top={4}>
        <NameText ml={windowWidth * 0.23} name={name} />
        <HealthText health={health} maxHealth={maxHealth} />
      </View>
    </Box>
  );
};

export default HealthProg;
