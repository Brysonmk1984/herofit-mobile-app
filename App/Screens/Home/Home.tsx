import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { Box, Button, View, Text, Icon, VStack, Link, Center, Image } from "native-base";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import debugErrors from "../../common/debugErrors";
import { GlobalStateContext } from "../../store";
import { MainStackProps } from "../../common/types-navigator";
import useModal from "../../common/hooks/useModal";
import { ChooseActivityEntry, SignupToSave, SignupFinished, ConfirmEmail, FeedbackChoice, ActivityUpgrade, GoToBattle } from "./Modals/Modals";
import Background from "./Components/Background";
import BottomDrawer from "./Components/BottomDrawer/BottomDrawer";
import { HeroImage } from "../../Components/HeroImage/HeroImage";
import { TopHud } from "./Components/TopHud/TopHud";
import { PetImage } from "./Components/PetImage";
import { DrawerIndicator, LoadingInPane, LoadingSpinner } from "../../Components/CustomComponents";
import { Activity, Hero } from "../../common/types";
import { upgradeSequence } from "../../api/avatar";
import buildGainsMessages from "./Components/gainsMessages";
import useStravaDataProcess from "./useStravaDataProcess";
import moment from "moment";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import useInventory from "../../common/hooks/useInventory";
import { clearLs } from "../../common/helperFunctions";
import SideMenu from "react-native-side-menu-updated";
import { AppState, Dimensions } from "react-native";
import SidebarMenu from "./Components/SidebarMenu";
import { reloadAsync } from "expo-updates";
import GestureRecognizer, { swipeDirections } from "react-native-swipe-gestures";
import * as Linking from "expo-linking";
import useAspectRatio from "../../common/hooks/useAspectRatio";

const Home: React.FC<MainStackProps<"Home">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const { newStravaActivities, getFreshStravaData } = useStravaDataProcess();
  const [newActivities, setNewActivities] = useState<Activity[]>([]);
  const { addToast } = useGlobalToast();
  const { equippedSkin, equippedPet, equippedTitle } = useInventory(true);
  const propsForHeroImage = (({ character, equipped, alias }) => ({ character, equipped, alias }))(state.hero);
  const { deviceWidth, deviceHeight, deviceAspectType } = useMemo(() => useAspectRatio(), []);
  const sideBarWidth = deviceWidth / 2;
  const isLongPhone = deviceAspectType === "long";
  const isMediumPhone = deviceAspectType === "medium";
  const heroImagePosition = isLongPhone ? deviceHeight * 0.52 : isMediumPhone ? deviceHeight * 0.53 : deviceHeight * 0.52;
  const petImagePosition = isLongPhone ? deviceHeight * 0.58 : isMediumPhone ? deviceHeight * 0.56 : deviceHeight * 0.5;
  const heroImageSize = isLongPhone ? 375 : isMediumPhone ? 300 : 275;
  const bottomDrawerHeight = isLongPhone ? deviceHeight / 2.8 : isMediumPhone ? deviceHeight / 2.6 : deviceHeight / 2.4;
  const hero = state.hero as Hero;
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [appIsReloading, setAppIsReloading] = useState(false);
  // Used only to disable the sidebar when the bottom menu is active
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
  // detect app  in foreground
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [backgroundAnimation, setBackgroundAnimation] = useState(null);

  async function handleHeroUpgrade(activities: Activity[]) {
    const user = state.user;
    try {
      // INSERT ACTIVITIES, UPDATE USER TOTALS, BUF AVATAR
      const upgradeResults = await upgradeSequence({ email: user.email, activities, accountDate: user.createdAt, hasBeenUpgraded: state.hero.hasBeenUpgraded });

      // Set Background Animation
      upgradeResults.reachedLevel ? setBackgroundAnimation("level-up") : setBackgroundAnimation("activity-up");

      // combine returned avatar with existing equipped items... backend not fetching equipment here
      const heroEquipped = Object.assign({}, state.hero, upgradeResults.avatar, { equipped: state.hero.equipped });

      const maxDate = moment.max(activities.map(act => moment(act.activityDate)));

      dispatch({ type: "POST UPGRADE", payload: { hero: heroEquipped, latestSavedActivities: [...state.latestSavedActivities, ...upgradeResults.activities], latestSavedActivityDate: maxDate } });
      setNewActivities([]);
      clearLs("herofit-stravaActivities");

      // Builds the Correct message based on returned data from upgrade
      const messageArray = buildGainsMessages(upgradeResults);

      // Show messages via toast
      messageArray.forEach((message: string, i: number) => {
        setTimeout(() => {
          addToast("success", message);
        }, 3000 * i);
      });
    } catch (error) {
      error.message = "Couldn't upgrade hero, please try again later.";
      addToast("error", error.message);
      debugErrors(error, user);
    }
  }

  // SWIPE DOWN - RELOAD APP
  function handleReload() {
    if (!bottomDrawerOpen) {
      setAppIsReloading(true);
      reloadAsync();
    }
  }

  // Handles detecting when the app comes back to the foreground
  const _handleAppStateChange = nextAppState => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      handleReload();
    }
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };
  // Only add Foreground listener is active user
  useEffect(() => {
    if (state.userStatus !== "new" && state.userStatus !== "unconfirmed" && state.user?.dataSrcId) {
      AppState.addEventListener("change", _handleAppStateChange);
      return () => AppState.removeEventListener("change", _handleAppStateChange);
    }
  }, []);

  // Alert user if they received an item on login (from get-avatar)
  useEffect(() => {
    if (state.awardedItemMessage) {
      addToast("success", state.awardedItemMessage, "bottom", 4000);
    }
  }, [state.awardedItemMessage]);

  // Determine which modal should pop up
  useEffect(() => {
    //console.log("SU", state.userStatus, state.user);
    if (state.userStatus === "new") {
      openModal("SignupToSave", 3000);
    } else if (state.userStatus === "unconfirmed") {
      openModal("ConfirmEmail", 6000);
    } else if (state.user === null || !state.user?.dataSrcId) {
      // if (!route.params?.blockOpenFromSettingsPage) {

      // }
      openModal("ChooseActivityEntry", 3000);
    }
  }, [state.userStatus, state.user, state.user?.dataSrcId]);

  // STRAVA Automatic Activity Data fetching
  useEffect(() => {
    //console.log("NSA", newStravaActivities);
    // For new users, newStravaActivities is undefined, otherwise it's an array
    if (newStravaActivities && newStravaActivities.length) {
      setNewActivities(newStravaActivities);
    }
  }, [newStravaActivities]);

  // MANUAL ACTIVITY
  useEffect(() => {
    if (route.params?.newManualActivity) {
      setNewActivities([...newActivities, route.params.newManualActivity]);
      openModal("ActivityUpgrade");
    }
  }, [route.params?.newManualActivity]);

  // STRAVA MANUALLY FETCHED - User Clicked the button to manually fetch data from the Manual page
  useEffect(() => {
    if (route.params?.fetchStravaManually) {
      getFreshStravaData(true);
    }
  }, [route.params?.fetchStravaManually]);

  return (
    <SideMenu disableGestures={(Boolean(state.initialHomescreenLoad) ?? false) || bottomDrawerOpen} bounceBackOnOverdraw={false} onChange={isOpen => setSideDrawerOpen(isOpen)} isOpen={sideDrawerOpen} menuPosition={"right"} menu={<SidebarMenu navigation={navigation} setSideDrawerOpen={setSideDrawerOpen} />} openMenuOffset={sideBarWidth}>
      <ScreenContainer bg={<Background animation={backgroundAnimation} setBackgroundAnimation={setBackgroundAnimation} />} screenName={route.name}>
        <View zIndex={110} elevation={110}>
          <GestureRecognizer onSwipeDown={state => handleReload()}>
            {/* TOP SECTION */}
            <View zIndex={110}>
              <TopHud equippedTitle={equippedTitle} />
              {state.isSignedIn && !state.initialHomescreenLoad && <DrawerIndicator setSideDrawerOpen={setSideDrawerOpen} />}
            </View>
            {/* HERO & PET */}
            <View h={heroImagePosition} zIndex={110}>
              <Box position="absolute" bottom={0} left="50%" ml={-(heroImageSize / 2)}>
                <HeroImage width={heroImageSize} height={heroImageSize} skin={equippedSkin} status={hero.status} floating={hero.status === "Knocked Out" ? false : true} {...propsForHeroImage} />
              </Box>
            </View>
          </GestureRecognizer>
          <Box position="absolute" zIndex={111} right={-5} top={petImagePosition}>
            {equippedPet && <PetImage pet={equippedPet} />}
          </Box>
        </View>
        {/* BOTTOM CONSOLE */}

        <BottomDrawer hero={state.hero} newActivitiesAvailable={newActivities.length > 0 ? true : false} latestBattle={state.latestBattle} user={state.user} setBottomDrawerOpen={setBottomDrawerOpen} bottomDrawerHeight={bottomDrawerHeight} initialDisabledLinks={state.initialHomescreenLoad} />

        {/* MODALS */}
        <SignupToSave id="SignupToSave" modalAction={() => dispatch({ type: "SET INITIAL HOMESCREEN LOAD", payload: { initialHomescreenLoad: "Register" } })} />
        <ConfirmEmail id="ConfirmEmail" />
        <ChooseActivityEntry id="ChooseActivityEntry" />
        <FeedbackChoice id="FeedbackChoice" />
        <SignupFinished id="SignupFinished" />
        <GoToBattle id="GoToBattle" goTo={navigation.push} heroId={hero.id} />

        {newActivities.length ? <ActivityUpgrade id="ActivityUpgrade" activities={newActivities} modalAction={() => handleHeroUpgrade(newActivities)} goBack={navigation.push} state={state} closeModal={closeModal} setNewActivities={setNewActivities} /> : null}

        {/* RELOADING IN PAGE */}
        {appIsReloading && <LoadingSpinner color="base.brand" size="lg" />}
      </ScreenContainer>
    </SideMenu>
  );
};

export default Home;
