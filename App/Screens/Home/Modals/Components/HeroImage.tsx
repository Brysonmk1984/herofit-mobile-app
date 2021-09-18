import { Box, Center, Image } from "native-base";
import React from "react";
import { Dimensions } from "react-native";
import { getHeroCostumeImage } from "../../../../common/helperFunctions";
import { useCharacterImage, useCostumeImage } from "../../../../common/hooks/useHeroImage";
import { CharacterName, CharacterAlias, HeroStatus, Skin } from "../../../../common/types";
import { HueRotate } from "gl-react-expo";

interface HeroImageProps {
  character: CharacterName;
  alias: CharacterAlias;
  status: HeroStatus;
  skin?: Skin;
}

export const HeroImage: React.FC<HeroImageProps> = ({ character, alias, skin = null, status }) => {
  const [char, setChar] = useCharacterImage(character);
  const [costume, setCostume, isTint] = useCostumeImage(character, skin);

  const tintHexMap = {
    "Fire Tint": "#e25822",
    "Earth Tint": "#8A360F",
    "Water Tint": "#0f5e9c",
    "Air Tint": "#16a0f5",
    "Banshee Tint": "#000000",
    "Poltergeist Tint": "#ffffff",
    "Specter Tint": "#ffffff",
    "Wraith Tint": "#000000",
    "Phantom Tint": "#000000",
    "Phantasm Tint": "#000000",
    "Shade Tint": "#000000",
    "Apparition Tint": "#ffffff",
  };
  const tintOpacityMap = {
    "Banshee Tint": 0.7,
    "Poltergeist Tint": 0.4,
    "Specter Tint": 0.5,
    "Wraith Tint": 0.9,
    "Phantom Tint": 0.6,
    "Phantasm Tint": 0.8,
    "Shade Tint": 1,
    "Apparition Tint": 0.3,
  };

  const darknessMap = {
    "Banshee Tint": 0.5,
    "Poltergeist Tint": 0.4,
    "Specter Tint": 0.5,
    "Wraith Tint": 0.3,
    "Phantom Tint": 0.6,
    "Phantasm Tint": 0.4,
    "Shade Tint": 0.2,
    "Apparition Tint": 0.3,
  };

  if (isTint) {
    return (
      <Center flex={2}>
        <Box w={275} h={275}>
          {" "}
          {/* Base Color tint */}
          <Image position="absolute" style={{ tintColor: tintHexMap[skin], opacity: tintOpacityMap[skin] || 1 }} source={costume} size={275} alt={alias} />
          {/* IMAGE - Shown on top of overlay */}
          <Image position="absolute" style={{ opacity: darknessMap[skin] || 0.5 }} source={costume} size={275} alt={alias} />
        </Box>
      </Center>
    );
  }
  return <Center flex={2}>{<Image source={costume} size={275} alt={alias} />}</Center>;
};
