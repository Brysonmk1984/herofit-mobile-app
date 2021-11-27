import React from "react";
import { Box, View, Text, HStack } from "native-base";
import { Icon } from "../../../../Components/CustomComponents";
import { CountUp } from "use-count-up";

interface HealthTextProps {
  health: number;
  maxHealth: number;
}

const HealthText: React.FC<HealthTextProps> = ({ health, maxHealth }) => {
  return (
    <View justifyContent="flex-end" flexDirection="row" flex={1}>
      <HStack space={1}>
        <Box opacity={0.5} mr={1} mt={1}>
          <Icon iconName="health" size={25} color="base.white" />
        </Box>
        <Text color={health < maxHealth ? "base.highlight" : "base.white"} fontSize="2xl" fontFamily="heading" mt={-0.5}>
          <CountUp isCounting end={health} duration={4} />
        </Text>
        <Text mt={-2.5} color="base.white" fontSize="4xl" fontFamily="heading">
          /
        </Text>
        <Text mt={-0.5} color="base.white" fontSize="2xl" fontFamily="heading">
          {maxHealth}
        </Text>
      </HStack>
    </View>
  );
};
export default HealthText;
