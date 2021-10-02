import React from "react";
import { Box, View, Text } from "native-base";
import { Icon } from "../../../../../Components/CustomComponents";
import { CountUp } from "use-count-up";

interface HealthTextProps {
  health: number;
  maxHealth: number;
}

const HealthText: React.FC<HealthTextProps> = ({ health, maxHealth }) => {
  return (
    <View justifyContent="flex-end" flexDirection="row" flex={1}>
      <Box opacity={0.5} mr={2} mt={-0.5}>
        <Icon iconName="health" size={25} color="base.white" />
      </Box>
      <Text color={health < maxHealth ? "base.highlight" : "base.white"} fontSize="lg" fontFamily="heading">
        <CountUp isCounting end={health} duration={3} />
      </Text>
      <Text mt={-2.5} color="base.white" fontSize="4xl" fontFamily="heading">
        /
      </Text>
      <Text mt={-0.5} color="base.white" fontSize="xl" fontFamily="heading">
        {maxHealth}
      </Text>
    </View>
  );
};
export default HealthText;
