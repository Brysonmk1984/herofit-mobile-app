import React from "react";
import { Box, Center, Image } from "native-base";
import useHeroImage from "../../../../common/hooks/useHeroImage";
import { CharacterName, CharacterAlias, HeroStatus, SkinName, Item } from "../../../../common/types";
import FloatingHeroImage from "./FloatingHeroImage";
import TintImage from "./TintedHeroImage";

interface HeroImageProps {
  character: CharacterName;
  alias: CharacterAlias;
  status?: HeroStatus;
  skin?: Item;
}

export const HeroImage: React.FC<HeroImageProps> = ({ character, alias, skin, status }) => {
  const skinName = skin?.name as SkinName;
  const { heroImage } = useHeroImage(character, skinName);
  const isTint = skinName?.includes("Tint") ?? false;

  function _renderImage(heroImage: number, skinName: string, imageMod?: string | undefined) {
    return (
      <Center>
        <Box w={275} h={275}>
          <FloatingHeroImage status={status}>{imageMod ? <TintImage heroImage={heroImage} skinName={skinName} imageMod={imageMod} /> : <Image position="absolute" bottom={100} source={heroImage} size={275} alt={skinName} />}</FloatingHeroImage>
        </Box>
      </Center>
    );
  }

  // If status isn't passed in, skip this check
  if (status && status !== "Rested") {
    // STATUS EFFECT = If Hero is under a status effect, return an image with the matching modified tint
    return _renderImage(heroImage, skinName, status);
  } else if (isTint) {
    // TINT COSTUME = If Hero has a special tint costume, return an image with the matching modified tint
    return _renderImage(heroImage, skinName, skinName);
  } else {
    // BASE SKIN OR UNIQUE COSTUME IMAGE, WITHOUT STATUS EFFECTS APPLIED
    return _renderImage(heroImage, skinName);
  }
};
