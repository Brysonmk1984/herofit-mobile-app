import React, { useEffect, useState } from "react";
import { getHeroImage } from "../helperFunctions";
import { CharacterName, SkinName } from "../types";

const useHeroImage = (character: CharacterName, skin?: SkinName): { heroImage: number } => {
  // CHARACTER WITH COSTUME - EITHER TINT OR NEW IMAGE
  // If no skin, base skin is returned
  const [costumeImage, setCostumeImage] = useState(getHeroImage(character));

  // When the skin changes (only from switching in inventory), set new skin to state
  useEffect(() => {
    if (skin) {
      setCostumeImage(getHeroImage(character, skin));
    }
  }, [skin]);

  return { heroImage: costumeImage };
};

export default useHeroImage;
