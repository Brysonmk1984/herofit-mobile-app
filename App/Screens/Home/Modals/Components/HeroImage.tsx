import { Box, Center, Image } from "native-base";
import React from "react";
import { Dimensions } from "react-native";
import { getHeroCostumeImage } from "../../../../common/helperFunctions";
import { useCharacterImage, useCostumeImage } from "../../../../common/hooks/useHeroImage";
import { CharacterName, CharacterAlias, HeroStatus, Skin } from "../../../../common/types";

interface HeroImageProps {
  character: CharacterName;
  alias: CharacterAlias;
  status: HeroStatus;
  skin?: Skin;
}

export const HeroImage: React.FC<HeroImageProps> = ({ character, alias, skin = null, status }) => {
  const [char, setChar] = useCharacterImage(character);
  const [costume, setCostume] = useCostumeImage(character, skin);
  console.log("COSTUME", costume);
  return <Center flex={2}>{<Image source={costume} size={275} alt={alias} />}</Center>;
};
