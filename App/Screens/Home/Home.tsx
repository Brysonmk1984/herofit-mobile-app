import React, { useContext, useEffect } from "react";
import { View } from "native-base";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import debugErrors from "../../common/debugErrors";
import { GlobalStateContext } from "../../store";
import { MainDrawerProps } from "../../common/types-navigator";
import useModal from "../../common/hooks/useModal";
import { getUser } from "../../api/user";
import { updateAlerts } from "../../common/alerts";
import { ChooseActivityEntry, SignupToSave, SignupFinished, ConfirmEmail, FeedbackChoice } from "./Modals/Modals";
import { DrawerIndicator } from "../../Components/DrawerIndicator";
import Background from "./Modals/Components/Background";
import BottomDrawer from "./Modals/Components/BottomDrawer";
import { equippedSkin } from "../../common/helperFunctions";
import { HeroImage } from "./Modals/Components/HeroImage";
import { TopHud } from "./Modals/Components/TopHud/TopHud";
import { HeroDetails } from "./Modals/Components/HeroDetails/HeroDetails";

const Home: React.FC<MainDrawerProps<"Home">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal } = useModal();

  const { health, maxHealth, thisLevelStartXp, nextLevelStartXp, equipped, qp } = state.hero;
  const attributesForHeroDetails = (({ name, status, photonTokens, activityXP, battleXP, goToBattle, level }) => ({ name, status, photonTokens, activityXP, battleXP, goToBattle, level }))(state.hero);
  const attributesForBottomConsole = (({ power, recovery, armor, fire, earth, water, air, aether }) => ({ power, recovery, armor, fire, earth, water, air, aether }))(state.hero);
  console.log("SH", equipped);

  function formActionHappens(data) {
    console.log("FORM ACTION FROM HOME!!!", data);
  }

  async function handleEmailConfirmed() {
    try {
      // * First time the user is assigned
      const { user } = await getUser({ email: state.user.email });
      console.log("UPDATED USER!", user);

      if (user.active) {
        dispatch({ type: "SET USER", payload: { user, isSignedIn: true } });
        dispatch({ type: "SET HERO", payload: { hero: { ...state.hero, qp: qp + 5 } } });
        dispatch({ type: "SET USER STATUS", payload: { userStatus: user.active ? "active" : "unconfirmed" } });
        setTimeout(() => {
          openModal("ChooseActivityEntry");
        }, 2000);
        // Open next modal
      } else {
        updateAlerts([{ type: "error", message: "Email Has not been confirmed; please click the link in your inbox." }], state, dispatch);
      }
    } catch (error) {
      debugErrors(error, state.user);
    }
  }

  useEffect(() => {
    //console.log("SU", state.userStatus, state.user);
    if (state.userStatus === "new") {
      openModal("SignupToSave", 2000);
    } else if (state.userStatus === "unconfirmed") {
      openModal("ConfirmEmail", 2000);
    } else if (state.user === null || !state.user?.dataSrcId) {
      openModal("ChooseActivityEntry", 2000);
    }
  }, [state.userStatus, state.user, state.user?.dataSrcId]);

  return (
    <ScreenContainer bg={<Background />} screenName={route.name}>
      {/* TOP SECTION */}
      <View justifyContent="flex-start">
        <TopHud healthObj={{ health, maxHealth }} xpObj={{ xp: 28, thisLevelStartXp, nextLevelStartXp }} />
        <HeroDetails {...attributesForHeroDetails} />
        <DrawerIndicator action={() => navigation.toggleDrawer()} />
      </View>

      {/* ABSOLUTE POSITIONED ELEMENTS */}
      <View position="absolute" bottom={0}>
        <HeroImage character={state.hero.character} alias={state.hero.alias} skin={equippedSkin(equipped)} status={state.hero.status} />
      </View>

      {/* BOTTOM CONSOLE */}
      <BottomDrawer attributes={attributesForBottomConsole} />

      {/* MODALS */}
      <SignupToSave id="SignupToSave" modalAction={() => navigation.push("Register")} />
      <ConfirmEmail id="ConfirmEmail" modalAction={handleEmailConfirmed} />
      <ChooseActivityEntry id="ChooseActivityEntry" />
      <FeedbackChoice id="FeedbackChoice" modalAction={formActionHappens} />
      <SignupFinished id="SignupFinished" />
    </ScreenContainer>
  );
};

export default Home;
