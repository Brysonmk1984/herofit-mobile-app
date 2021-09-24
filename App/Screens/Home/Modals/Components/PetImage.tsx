import React from "react";
import { Center, Box, Image } from "native-base";
import { tintHexMap, tintOpacityMap } from "../../../../common/hexAndOpacityMaps";
import { getPetImage } from "../../../../common/helperFunctions";

interface PetImageProps {
  pet: Item;
}

export const PetImage: React.FC<PetImageProps> = ({ pet }) => {
  const petName = pet?.name;
  return petName ? (
    <Box position="absolute" left={0} bottom={75}>
      <Image resizeMode="contain" source={getPetImage(petName)} size={125} alt={petName} />
    </Box>
  ) : null;
};
