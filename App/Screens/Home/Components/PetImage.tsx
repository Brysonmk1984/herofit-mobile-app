import React from "react";
import { Center, Box, Image } from "native-base";
import { tintHexMap, tintOpacityMap } from "../../../common/hexAndOpacityMaps";
import { getPetImage } from "../../../common/helperFunctions";
import { Item } from "../../../common/types";

interface PetImageProps {
  pet: Item;
}

export const PetImage: React.FC<PetImageProps> = ({ pet }) => {
  const petName = pet?.name;
  return petName ? (
    <Box position="absolute" right={0} bottom={95}>
      <Image resizeMode="contain" source={getPetImage(petName)} size={120} alt={petName} />
    </Box>
  ) : null;
};
