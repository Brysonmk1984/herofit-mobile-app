import React, { useContext, useEffect, useState } from "react";
import { View, Image, Text } from "native-base";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import debugErrors from "../../common/debugErrors";
import { GlobalStateContext } from "../../store";
import { MainDrawerProps } from "../../common/types-navigator";
import useModal from "../../common/hooks/useModal";
import { getUser } from "../../api/user";
import { updateAlerts } from "../../common/alerts";
import { ChooseActivityEntry, SignupToSave, SignupFinished, ConfirmEmail, FeedbackChoice } from "./Modals/Modals";
import Background from "./Modals/Components/Background";
import BottomDrawer from "./Modals/Components/BottomDrawer/BottomDrawer";
import { determineDataSrcType, equippedPet, equippedSkin, equippedTitle, getLsWithExpiry } from "../../common/helperFunctions";
import { HeroImage } from "./Modals/Components/HeroImage/HeroImage";
import { TopHud } from "./Modals/Components/TopHud/TopHud";
import { HeroDetails } from "./Modals/Components/HeroDetails/HeroDetails";
import { PetImage } from "./Modals/Components/PetImage";
import { DrawerIndicator } from "../../Components/CustomComponents";
import useStravaDataProcess from "./useStravaDataProcess";
import { Activity } from "../../common/types";
import { isExistingHero } from "../../common/typeGuards";
import { StravaActivityUpgrade } from "./Modals/StravaActivityUpgrade";

const Home: React.FC<MainDrawerProps<"Home">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const hero = state.hero;

  const propsForHeroImage = (({ character, equipped, alias, status }) => ({ character, equipped, alias, skin: equippedSkin(equipped), status }))(state.hero);
  const propsForBottomConsole = (({ power, recovery, armor, fire, earth, water, air, aether, photonTokens, goToBattle, qp }) => ({ power, recovery, armor, fire, earth, water, air, aether, photonTokens, goToBattle, qp }))(state.hero);

  // Determine which modal should pop up
  useEffect(() => {
    //console.log("SU", state.userStatus, state.user);
    if (state.userStatus === "new") {
      openModal("SignupToSave", 3000);
    } else if (state.userStatus === "unconfirmed") {
      console.log("ABOUT TO OPEN ConfirmEmail");
      openModal("ConfirmEmail", 6000);
    } else if (state.user === null || !state.user?.dataSrcId) {
      openModal("ChooseActivityEntry", 3000);
    }
  }, [state.userStatus, state.user, state.user?.dataSrcId]);

  return (
    <ScreenContainer bg={<Background />} screenName={route.name}>
      {/* TOP SECTION */}
      <View>
        <TopHud />
        {state.isSignedIn && <DrawerIndicator />}
      </View>
      {/* HERO & PET */}
      <View>
        <HeroImage {...propsForHeroImage} />
        <PetImage pet={equippedPet(state.hero?.equipped)} />
      </View>

      {/* BOTTOM CONSOLE */}
      <BottomDrawer {...propsForBottomConsole} />

      {/* MODALS */}
      <SignupToSave id="SignupToSave" modalAction={() => navigation.push("Register")} />
      <ConfirmEmail id="ConfirmEmail" />
      <ChooseActivityEntry id="ChooseActivityEntry" />
      <FeedbackChoice id="FeedbackChoice" />
      <SignupFinished id="SignupFinished" />
    </ScreenContainer>
  );
};

export default Home;
