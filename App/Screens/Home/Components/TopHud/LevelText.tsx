import React, { useEffect } from "react";
import { Box, HStack, Text } from "native-base";
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
        <HStack ml={1} mt={0.5}>
          <Text ml={2} opacity={0.5} color="base.aether" numberOfLines={1} fontSize="lg" lineHeight="xl">
            ALBEDO
          </Text>
          <Text ml={1} opacity={1} color="base.aether" fontFamily="heading" fontSize={24}>
            {albedo}
          </Text>
        </HStack>
      ) : (
        <HStack ml={1} mt={0.5}>
          <Text opacity={0.5} color="base.white" numberOfLines={1} fontSize="lg" lineHeight="xl">
            LEVEL
          </Text>
          <Text ml={1} opacity={1} color="base.highlight" fontFamily="heading" fontSize="2xl">
            {level}
          </Text>
        </HStack>
      )}
    </Box>
  );
};
export default LevelText;
