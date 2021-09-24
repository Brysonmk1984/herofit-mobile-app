import React, { useEffect } from "react";
import { Box, Text } from "native-base";
import { fontSize } from "styled-system";

interface NameTextProps {
  name: string;
  ml: number;
}

const NameText: React.FC<NameTextProps> = ({ name, ml }) => {
  const longName = name.length >= 13;

  return (
    <Box ml={ml} mt={longName ? 0 : -1.5} flex={2}>
      <Text numberOfLines={1} ellipsizeMode="tail" fontSize={longName ? 20 : 30} fontFamily="heading" color="base.highlight">
        {name}
      </Text>
    </Box>
  );
};
export default NameText;
