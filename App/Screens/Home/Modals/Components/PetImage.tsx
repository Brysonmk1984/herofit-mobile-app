import React from "react";
import { Center, Box, Image } from "native-base";
import { tintHexMap, tintOpacityMap } from "../../../../common/hexAndOpacityMaps";
import { getPetImage } from "../../../../common/helperFunctions";

interface PetImageProps {
  pet: object;
}

export const PetImage: React.FC<PetImageProps> = ({ pet }) => {
  return (
    <Box position="absolute" left={0} bottom={75}>
      <Image source={getPetImage(pet.name)} size={125} alt={pet.name} />
    </Box>
  );
};
