import React from "react";
import { Box, Center, Image } from "native-base";
import { getFoeImage } from "../common/helperFunctions";
import { FoeType, CharacterName } from "../common/types";

interface FoeImageProps {
  foeType: FoeType;
  heroCharacterName: CharacterName;
  width?: number;
  height?: number;
}

const FoeImage: React.FC<FoeImageProps> = ({ foeType, heroCharacterName, width = 275, height = 275 }) => {
  return (
    <Center>
      <Box w={width} h={height}>
        <Image source={getFoeImage(foeType, heroCharacterName)} size={height} alt={foeType} />
      </Box>
    </Center>
  );
};

export default FoeImage;
