import React from "react";
import { Image, Box } from "native-base";
import { tintHexMap, darknessMap } from "../../common/hexAndOpacityMaps";

interface TintedHeroImageProps {
  heroImage: number;
  skinName: string;
  // Image Mod is different depending on status and tint costumes
  imageMod: string;
  size?: number;
}

const TintedHeroImage: React.FC<TintedHeroImageProps> = ({ heroImage, skinName, imageMod, size = 275 }) => {
  return (
    <Box size={size}>
      {/* Base Color tint */}
      <Image position="absolute" style={{ tintColor: tintHexMap[imageMod] }} source={heroImage} size={size} alt={skinName} resizeMode="contain" />
      {/* IMAGE - Shown on top of overlay */}
      <Image position="absolute" style={{ opacity: darknessMap[imageMod] || 0.5 }} source={heroImage} size={size} alt={skinName} resizeMode="contain" />
    </Box>
  );
};

export default TintedHeroImage;
