import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { MainDrawerProps } from "../../../common/types-navigator";
import { ScreenContainer } from "../../../Components/CustomComponents";
import VsSection from "./VsSection";
import HeroSection from "./HeroSection";
import FoeSection from "./FoeSection";

const AwaitingBattle: React.FC<MainDrawerProps<"AwaitingBattle">> = ({ navigation, route }) => {
  const { height, width } = useWindowDimensions();
  const { foe, rewards, character } = route.params;

  // TODO:
  // On item click, open Item modal
  // Run Battle now button when applicable

  useEffect(() => {
    const screenPop = setTimeout(() => {
      navigation.pop();
    }, 6000);

    return () => clearTimeout(screenPop);
  }, []);

  return (
    <ScreenContainer screenName={route.name}>
      <HeroSection rewards={rewards} height={height} width={width} />
      <FoeSection foe={foe} height={height} width={width} character={character} />
      <VsSection height={height} pop={navigation.pop} />
    </ScreenContainer>
  );
};

export default AwaitingBattle;
