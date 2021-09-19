import React, { useEffect, useState } from "react";
import { getHeroImage } from "../helperFunctions";
import { Skin } from "../types";

const useHeroImage = (character: string, skin?: Skin): { baseImage: number; costumeImage: number; isTint: boolean } => {
  const isTint = skin?.includes("Tint") ?? false;

  // BASE CHARACTER IMAGE
  const [baseImage, setBaseImage] = useState(getHeroImage(character));
  // CHARACTER WITH COSTUME - EITHER TINT OR NEW IMAGE
  const [costumeImage, setCostumeImage] = useState(getHeroImage(character, skin));

  // When the skin changes (only from switching in inventory), set new skin to state
  useEffect(() => {
    setCostumeImage(getHeroImage(character, skin));
  }, [skin]);

  return { baseImage, costumeImage, isTint };
};

export default useHeroImage;
