import React, { ReactChild, ReactElement } from "react";
import { Animated } from "react-native";
import { View } from "native-base";
import useFloating from "../../../../common/hooks/useFloating";
import { HeroStatus } from "../../../../common/types";

interface FloatingHeroImageProps {
  children: React.ReactChild;
  status: HeroStatus;
}

const FloatingHeroImage = ({ children, status }: FloatingHeroImageProps): ReactElement => {
  const { floating, floatAnimation } = useFloating(status !== "Knocked Out");
  return floating ? <Animated.View style={{ transform: [{ translateY: floatAnimation }] }}>{children}</Animated.View> : (children as ReactElement);
};

export default FloatingHeroImage;
