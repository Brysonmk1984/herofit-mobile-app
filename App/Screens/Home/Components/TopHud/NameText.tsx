import React, { useEffect } from "react";
import { Box, Text } from "native-base";
import { fontSize } from "styled-system";

interface NameTextProps {
  name: string;
  ml: number;
  windowWidth: number;
}

const NameText: React.FC<NameTextProps> = ({ name, ml, windowWidth }) => {
  const longName = name.length >= 11;
  const reallyLongName = name.length >= 15;

  return (
    <Box ml={ml} mt={longName ? 0 : -1.5} flex={2}>
      <Text ml={1} mt={reallyLongName ? 1.5 : longName ? 0.4 : 0.5} numberOfLines={1} width={windowWidth * 0.4} fontSize={reallyLongName ? 20 : longName ? 25 : 30} fontFamily="heading" color="base.highlight">
        {name}
      </Text>
    </Box>
  );
};
export default NameText;
