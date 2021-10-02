import React, { useEffect } from "react";
import { Box, Text } from "native-base";
import { fontSize } from "styled-system";

interface LevelTextProps {
  level: number;
  albedo: number;
  ml: number;
}

const LevelText: React.FC<LevelTextProps> = ({ level, albedo, ml }) => {
  return (
    <Box flexDirection="row" ml={ml} mt={-2} flex={2}>
      {albedo ? (
        <>
          <Text ml={2} opacity={0.5} color="base.aether" numberOfLines={1} fontSize={16}>
            ALBEDO:
          </Text>
          <Text ml={1} opacity={1} color="base.aether" fontFamily="heading" fontSize={24}>
            {albedo}
          </Text>
        </>
      ) : (
        <>
          <Text opacity={0.5} color="base.primary" numberOfLines={1} fontSize={16}>
            LEVEL:
          </Text>
          <Text ml={1} mt={0.5} opacity={1} color="base.primary" fontFamily="heading" fontSize={22}>
            {level}
          </Text>
        </>
      )}
    </Box>
  );
};
export default LevelText;
