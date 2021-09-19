import React from "react";
import { Box, View, Text } from "native-base";
import { Icon } from "../../../../../Components/CustomComponents";

interface HealthTextProps {
  health: number;
  maxHealth: number;
}

const HealthText: React.FC<HealthTextProps> = ({ health, maxHealth }) => {
  return (
    <View flexDirection="row" position="absolute" right={4} top={4}>
      <Box opacity={0.5} mr={2} mt={-0.5}>
        <Icon iconName="health" size={25} color="base.white" />
      </Box>
      <Text color="base.highlight" fontSize="lg" fontFamily="heading">
        {health}
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
