import React, { useEffect, useState } from "react";
import { getHeroCostumeImage, getHeroImage } from "../helperFunctions";
import { Skin } from "../types";

export const useCharacterImage = (character: string): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const [char, setChar] = useState(getHeroImage(character));

  return [char, setChar];
};

export const useCostumeImage = (character: string, skin: Skin | null) => {
  const [costume, setCostume] = useState(getHeroCostumeImage(character, skin));

  return [costume, setCostume];
};

// interface useStatusImageProps {
//   character : string
// }

// export const useStatusImage = ({character} : useStatusImageProps) => {
//   return ();
// }
