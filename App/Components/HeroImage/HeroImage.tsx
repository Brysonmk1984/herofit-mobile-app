import React, { useEffect } from "react";
import { Box, Center, Image } from "native-base";
import useHeroImage from "../../common/hooks/useHeroImage";
import { CharacterName, CharacterAlias, HeroStatus, SkinName, Item } from "../../common/types";
import FloatingHeroImage from "./FloatingHeroImage";
import TintImage from "./TintedHeroImage";

interface HeroImageProps {
  character: CharacterName;
  width?: number;
  height?: number;
  status?: HeroStatus;
  skin?: Item;
  floating?: boolean;
}

export const HeroImage: React.FC<HeroImageProps> = ({ character, width = 275, height = 275, skin, status, floating = false }) => {
  const skinName = skin?.name as SkinName;
  const { heroImage } = useHeroImage(character, skinName);
  const isTint = skinName?.includes("Tint") ?? false;

  function determineImage(imageMod: SkinName | HeroStatus) {
    if (floating) {
      if (imageMod) {
        return (
          <FloatingHeroImage status={status}>
            <TintImage heroImage={heroImage} skinName={skinName} imageMod={imageMod} size={height} />
          </FloatingHeroImage>
        );
      } else {
        return (
          <FloatingHeroImage status={status}>
            <Image key={heroImage} source={heroImage} size={height} alt={skinName} resizeMode="contain" />
          </FloatingHeroImage>
        );
      }
    } else if (imageMod) {
      return <TintImage heroImage={heroImage} skinName={skinName} imageMod={imageMod} size={height} />;
    } else {
      return <Image key={heroImage} source={heroImage} size={height} alt={skinName} resizeMode="contain" />;
    }
  }

  function _renderImage(imageMod?: SkinName | HeroStatus) {
    return (
      <Center>
        <Box w={width} h={height}>
          {determineImage(imageMod)}
        </Box>
      </Center>
    );
  }

  // If status isn't passed in, skip this check
  if (status && status !== "Rested" && status !== "Recovering") {
    // STATUS EFFECT = If Hero is under a status effect, return an image with the matching modified tint
    return _renderImage(status);
  } else if (isTint) {
    // TINT COSTUME = If Hero has a special tint costume, return an image with the matching modified tint
    return _renderImage(skinName);
  } else {
    // BASE SKIN OR UNIQUE COSTUME IMAGE, WITHOUT STATUS EFFECTS APPLIED
    return _renderImage();
  }
};
