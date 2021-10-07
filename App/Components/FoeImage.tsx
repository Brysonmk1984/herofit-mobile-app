import React from "react";
import { Box, Center, Image } from "native-base";
import { getFoeImage } from "../common/helperFunctions";
import { FoeType, CharacterName } from "../common/types";

interface FoeImageProps {
  foeType: FoeType;
  heroCharacterName: CharacterName;
}

const FoeImage: React.FC<FoeImageProps> = ({ foeType, heroCharacterName }) => {
  return (
    <Center>
      <Box w={275} h={275}>
        <Image source={getFoeImage(foeType, heroCharacterName)} size={275} alt={foeType} />
      </Box>
    </Center>
  );
};

export default FoeImage;
