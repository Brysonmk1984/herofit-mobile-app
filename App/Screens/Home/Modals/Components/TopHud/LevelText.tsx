import React, { useEffect } from "react";
import { Box, Text } from "native-base";
import { fontSize } from "styled-system";

interface LevelTextProps {
  level: number;
  ml: number;
}

const LevelText: React.FC<LevelTextProps> = ({ level, ml }) => {
  return (
    <Box flexDirection="row" ml={ml} mt={-2} flex={2}>
      <Text opacity={0.5} color="base.primary" numberOfLines={1} fontSize={16}>
        LEVEL:
      </Text>
      <Text ml={2} opacity={1} color="base.highlight" fontFamily="heading" fontSize={24}>
        {level}
      </Text>
    </Box>
  );
};
export default LevelText;
