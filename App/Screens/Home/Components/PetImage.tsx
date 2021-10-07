import React from "react";
import { Center, Box, Image } from "native-base";
import { tintHexMap, tintOpacityMap } from "../../../common/hexAndOpacityMaps";
import { getPetImage } from "../../../common/helperFunctions";
import { Item } from "../../../common/types";

interface PetImageProps {
  pet: Item;
  width?: number;
  height?: number;
}

export const PetImage: React.FC<PetImageProps> = ({ pet, width = 120, height = 120 }) => {
  const petName = pet?.name;
  return petName ? (
    <Center>
      <Box>
        <Image resizeMode="contain" source={getPetImage(petName)} size={height} alt={petName} />
      </Box>
    </Center>
  ) : null;
};
