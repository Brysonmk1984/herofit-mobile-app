import React from "react";
import { Box, View, Text } from "native-base";
import { CountUp } from "use-count-up";

interface XpTextProps {
  levelXp: number;
  levelXpRequired: number;
}

const XpText: React.FC<XpTextProps> = ({ levelXp, levelXpRequired }) => {
  return (
    <View flexDirection="row" position="absolute" right={3} top={1.5}>
      <Box opacity={0.5} mr={2} mt={-2.5}>
        <Text color="base.white" fontSize="xl">
          XP
        </Text>
      </Box>
      <Text color="base.highlight" fontSize="sm" fontFamily="heading">
        <CountUp isCounting end={levelXp} duration={2} />
      </Text>
      <Text mt={-1.5} color="base.white" fontSize="2xl" fontFamily="heading">
        /
      </Text>
      <Text mt={-0.5} color="base.white" fontSize="md" fontFamily="heading">
        {levelXpRequired}
      </Text>
    </View>
  );
};

export default XpText;
