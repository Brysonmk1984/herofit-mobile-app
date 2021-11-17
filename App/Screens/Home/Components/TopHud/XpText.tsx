import React, { useEffect } from "react";
import { Box, View, Text, HStack } from "native-base";
import { CountUp, useCountUp } from "use-count-up";

interface XpTextProps {
  levelXp: number;
  levelXpRequired: number;
  prevXpGained: number;
}

const XpText: React.FC<XpTextProps> = ({ levelXp, levelXpRequired, prevXpGained }) => {
  const { value, reset } = useCountUp({ isCounting: true, end: levelXp, duration: 5, start: prevXpGained });

  useEffect(() => {
    if (levelXp) {
      reset();
    }
  }, [levelXp]);
  return (
    <View flexDirection="row">
      <HStack space={1} mt={-0.5}>
        <Text mr={1} opacity={0.5} color="base.white" fontSize="xl">
          XP
        </Text>
        <Text fontSize="lg" lineHeight="xl" fontFamily="heading" color="base.highlight">
          {value}
        </Text>
        <Text lineHeight="sm" color="base.white" fontSize="2xl" fontFamily="heading">
          /
        </Text>
        <Text lineHeight="lg" color="base.white" fontSize="xl" fontFamily="heading">
          {levelXpRequired}
        </Text>
      </HStack>
    </View>
  );
};

export default XpText;
