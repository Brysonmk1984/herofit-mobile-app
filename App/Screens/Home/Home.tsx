import React, { useContext, useEffect, useState, useRef } from "react";
import { Box, Button, View, Text, Icon, VStack, Link, Center } from "native-base";
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

const Home: React.FC<MainStackProps<"Home">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const { newStravaActivities, getFreshStravaData } = useStravaDataProcess();
  const [newActivities, setNewActivities] = useState<Activity[]>([]);
  const { addToast } = useGlobalToast();
  const { equippedSkin, equippedPet, equippedTitle } = useInventory(true);
  const propsForHeroImage = (({ character, equipped, alias, status }) => ({ character, equipped, alias, skin: equippedSkin, status, floating: true }))(state.hero);
  const sideBarWidth = Dimensions.get("window").width / 2;
  const deviceHeight = Dimensions.get("window").height;
  const hero = state.hero as Hero;
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [appIsReloading, setAppIsReloading] = useState(false);
  // Used only to disable the sidebar when the bottom menu is active
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
  // detect app  in foreground
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  async function handleHeroUpgrade(activities: Activity[]) {
    const user = state.user;
    try {
      // INSERT ACTIVITIES, UPDATE USER TOTALS, BUF AVATAR
      const upgradeResults = await upgradeSequence({ email: user.email, activities, accountDate: user.createdAt, hasBeenUpgraded: state.hero.hasBeenUpgraded });

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
        }, 1500 * i);
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

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => AppState.removeEventListener("change", _handleAppStateChange);
  }, []);

  // Determine which modal should pop up
  useEffect(() => {
    //console.log("SU", state.userStatus, state.user);
    if (state.userStatus === "new") {
      openModal("SignupToSave", 3000);
    } else if (state.userStatus === "unconfirmed") {
      openModal("ConfirmEmail", 6000);
    } else if (state.user === null || !state.user?.dataSrcId) {
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
    <SideMenu disableGestures={bottomDrawerOpen} bounceBackOnOverdraw={false} onChange={isOpen => setSideDrawerOpen(isOpen)} isOpen={sideDrawerOpen} menuPosition={"right"} menu={<SidebarMenu navigation={navigation} setSideDrawerOpen={setSideDrawerOpen} />} openMenuOffset={sideBarWidth}>
      <ScreenContainer bg={<Background />} screenName={route.name}>
        <View zIndex={110} elevation={110}>
          <GestureRecognizer onSwipeDown={state => handleReload()}>
            {/* TOP SECTION */}
            <View>
              <TopHud equippedTitle={equippedTitle} />
              {state.isSignedIn && <DrawerIndicator setSideDrawerOpen={setSideDrawerOpen} />}
            </View>
            {/* HERO & PET */}
            <View zIndex={110} elevation={110}>
              <Box position="absolute" bottom={-(deviceHeight * 0.5)} left="50%" ml={-138}>
                <HeroImage {...propsForHeroImage} />
              </Box>
              <Box position="absolute" right={-5} bottom={-(deviceHeight * 0.6)}>
                {equippedPet && <PetImage pet={equippedPet} />}
              </Box>
            </View>
          </GestureRecognizer>
        </View>
        {/* BOTTOM CONSOLE */}
        <BottomDrawer hero={state.hero} newActivitiesAvailable={newActivities.length > 0 ? true : false} latestBattle={state.latestBattle} user={state.user} setBottomDrawerOpen={setBottomDrawerOpen} />

        {/* MODALS */}
        <SignupToSave id="SignupToSave" modalAction={() => navigation.push("Register")} />
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
