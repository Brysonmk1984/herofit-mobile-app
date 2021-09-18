import React, { useEffect, useState } from "react";
import { getHeroCostumeImage, getHeroImage } from "../helperFunctions";
import { Skin } from "../types";

export const useCharacterImage = (character: string): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const [char, setChar] = useState(getHeroImage(character));

  return [char, setChar];
};

export const useCostumeImage = (character: string, skin: Skin | null): [number, React.Dispatch<React.SetStateAction<number>>, boolean] => {
  const isTint = skin.includes("Tint");

  // If Skin is a tint, just return regular character image, otherwise  get actual unique image
  const [costume, setCostume] = isTint ? useState(getHeroImage(character)) : useState(getHeroCostumeImage(character, skin));

  return [costume, setCostume, isTint];
};

// interface useStatusImageProps {
//   character : string
// }

// export const useStatusImage = ({character} : useStatusImageProps) => {
//   return ();
// }
