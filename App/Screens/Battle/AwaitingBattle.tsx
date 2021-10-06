import React, { useContext } from "react";
import { Box, View, Text, VStack } from "native-base";
import { GlobalStateContext } from "../../store";
import { CountdownTimer } from "../Home/Components/TopHud/CountdownTimer";
import { MainDrawerProps } from "../../common/types-navigator";
import { ScreenContainer } from "../../Components/CustomComponents";
import { HeroImage } from "../Home/Components/HeroImage/HeroImage";
import { PetImage } from "../Home/Components/PetImage";
import { equippedPet, equippedSkin } from "../../common/helperFunctions";

const AwaitingBattle: React.FC<MainDrawerProps<"AwaitingBattle">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const propsForHeroImage = (({ character, equipped, alias, status }) => ({ character, equipped, alias, skin: equippedSkin(equipped), status }))(state.hero);

  // avatar={avatar}
  // upcomingFoe={upcomingFoe}
  // upcomingRewards={upcomingRewards}
  // handleItemClick={handleItemClick}
  // runBattleNow={runBattleNow}

  console.log("PARAMS!", route.params);

  return (
    <ScreenContainer screenName={route.name}>
      <Box flex={1}>
        <HeroImage {...propsForHeroImage} />
        <PetImage pet={equippedPet(state.hero?.equipped)} />
      </Box>
      <Box flex={1}>
        <Text>The Foe</Text>
      </Box>
      <VStack w="100%" justifyContent="center" alignItems="center" position="absolute" top="50%">
        <Text fontSize={100} fontFamily="heading">
          VS
        </Text>
        <CountdownTimer hideType={true} type={"Battle"} />
      </VStack>
    </ScreenContainer>
  );
};

export default AwaitingBattle;
