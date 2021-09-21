import { Box, Center, Image } from "native-base";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Dimensions } from "react-native";
import { tintHexMap, tintOpacityMap, darknessMap } from "../../../../common/hexAndOpacityMaps";
import useFloating from "../../../../common/hooks/useFloating";
import useHeroImage from "../../../../common/hooks/useHeroImage";
import { CharacterName, CharacterAlias, HeroStatus, SkinName } from "../../../../common/types";

interface HeroImageProps {
  character: CharacterName;
  alias: CharacterAlias;
  status?: HeroStatus;
  skin?: SkinName;
}

export const HeroImage: React.FC<HeroImageProps> = ({ character, alias, skin, status }) => {
  const { heroImage } = useHeroImage(character, skin);
  const { floating, floatAnimation } = useFloating(status !== "Knocked Out");
  const isTint = skin?.includes("Tint") ?? false;

  // STATUS EFFECT = If Hero is under a status effect, return an image with the matching modified tint
  function renderHeroUnderStatusEffect() {
    return (
      <Center flex={2} w={275} h={275}>
        <Box>
          {" "}
          {/* Base Color tint */}
          <Image position="absolute" bottom={100} style={{ tintColor: tintHexMap[status], opacity: tintOpacityMap[status] || 1 }} source={heroImage} size={275} alt={alias} />
          {/* IMAGE - Shown on top of overlay */}
          <Image position="absolute" bottom={100} style={{ opacity: darknessMap[status] || 0.5 }} source={heroImage} size={275} alt={alias} />
        </Box>
      </Center>
    );
  }

  // TINT COSTUME = If Hero has a special tint costume, return an image with the matching modified tint
  function renderHeroWithTintCostume() {
    return (
      <Center>
        <Box w={275} h={275}>
          {" "}
          {/* Base Color tint */}
          <Image position="absolute" bottom={100} style={{ tintColor: tintHexMap[skin], opacity: tintOpacityMap[skin] || 1 }} source={heroImage} size={275} alt={alias} />
          {/* IMAGE - Shown on top of overlay */}
          <Image position="absolute" bottom={100} style={{ opacity: darknessMap[skin] || 0.5 }} source={heroImage} size={275} alt={alias} />
        </Box>
      </Center>
    );
  }

  // If status isn't passed in, skip this check
  if (status && status !== "Rested") {
    // Return status effect tint on unique image costume or base skin
    return renderHeroUnderStatusEffect();
  } else if (isTint) {
    // Return tinted base skin.
    return renderHeroWithTintCostume();
  } else {
    // Return unique image costumes or the base skin
    return (
      <Center>
        <Box w={275} h={275}>
          {floating ? <Animated.View style={{ translateY: floatAnimation }}>{<Image position="absolute" bottom={100} source={heroImage} size={275} alt={alias} />}</Animated.View> : <Image position="absolute" bottom={100} source={heroImage} size={275} alt={alias} />}
        </Box>
      </Center>
    );
  }
};
