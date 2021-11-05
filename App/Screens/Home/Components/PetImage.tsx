import React from "react";
import { Center, Box, Image } from "native-base";
import { tintHexMap, tintOpacityMap } from "../../../common/hexAndOpacityMaps";
import { getPetImage } from "../../../common/helperFunctions";
import { Item } from "../../../common/types";

interface PetImageProps {
  pet: Item;
  size?: number;
}

export const PetImage: React.FC<PetImageProps> = ({ pet, size = 120 }) => {
  const petName = pet.name;
  const petSourceImageNum = getPetImage(petName);
  return petName ? (
    <Center>
      <Box>
        <Image key={petSourceImageNum} resizeMode="contain" source={petSourceImageNum} size={size} alt={petName} />
      </Box>
    </Center>
  ) : null;
};
