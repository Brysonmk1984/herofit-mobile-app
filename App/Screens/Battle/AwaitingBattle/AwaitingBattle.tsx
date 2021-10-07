import React from "react";
import { useWindowDimensions } from "react-native";
import { MainDrawerProps } from "../../../common/types-navigator";
import { ScreenContainer } from "../../../Components/CustomComponents";
import VsSection from "./VsSection";
import HeroSection from "./HeroSection";
import FoeSection from "./FoeSection";

const AwaitingBattle: React.FC<MainDrawerProps<"AwaitingBattle">> = ({ navigation, route }) => {
  const { height } = useWindowDimensions();
  const { foe, rewards } = route.params;

  // TODO:
  // On item click, open Item modal
  // Run Battle now button when applicable

  return (
    <ScreenContainer screenName={route.name}>
      <HeroSection rewards={rewards} height={height} />
      <FoeSection foe={foe} height={height} />
      <VsSection height={height} />
    </ScreenContainer>
  );
};

export default AwaitingBattle;
