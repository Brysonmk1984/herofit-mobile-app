import React from "react";
import { Image } from "native-base";
import { tintHexMap, darknessMap } from "../../../../common/hexAndOpacityMaps";

interface TintedHeroImageProps {
  heroImage: number;
  skinName: string;
  // Image Mod is different depending on status and tint costumes
  imageMod: string;
}

const TintedHeroImage: React.FC<TintedHeroImageProps> = ({ heroImage, skinName, imageMod }) => {
  return (
    <>
      {/* Base Color tint */}
      <Image position="absolute" bottom={100} style={{ tintColor: tintHexMap[imageMod] }} source={heroImage} size={275} alt={skinName} />
      {/* IMAGE - Shown on top of overlay */}
      <Image position="absolute" bottom={100} style={{ opacity: darknessMap[imageMod] || 0.5 }} source={heroImage} size={275} alt={skinName} />
    </>
  );
};

export default TintedHeroImage;
