import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { Box, View } from "native-base";
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
import { DrawerIndicator } from "../../Components/CustomComponents";
import { Activity, Hero } from "../../common/types";
import { UpgradeResults, upgradeSequence } from "../../api/avatar";
import buildGainsMessages from "./Components/gainsMessages";
import useStravaDataProcess from "../../common/hooks/useStravaDataProcess";
import moment from "moment";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import useInventory from "../../common/hooks/useInventory";
import { clearLs } from "../../common/helperFunctions";
import SideMenu from "react-native-side-menu-updated";
import SidebarMenu from "./Components/SidebarMenu";
import GestureRecognizer from "react-native-swipe-gestures";
import useAspectRatio from "../../common/hooks/useAspectRatio";
import LevelUpText from "./Components/LevelUpText";
import useServerMessage from "../../common/hooks/useServerMessage";
import useAppDataFetch from "../../common/hooks/useAppDataFetch";

const Home: React.FC<MainStackProps<"Home">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const { newStravaActivities, getFreshStravaData } = useStravaDataProcess();
  const [newActivities, setNewActivities] = useState<Activity[]>([]);
  const { addToast } = useGlobalToast();
  const { getAllAppData } = useAppDataFetch();
  const { equippedSkin, equippedPet, equippedTitle, fetchAndUpdateInventory } = useInventory(true);
  const { deviceWidth, deviceHeight, deviceAspectType } = useMemo(() => useAspectRatio(), []);
  const sideBarWidth = deviceWidth / 2;
  const isLongPhone = deviceAspectType === "long";
  const isMediumPhone = deviceAspectType === "medium";
  const heroImagePosition = isLongPhone ? deviceHeight * 0.52 : isMediumPhone ? deviceHeight * 0.54 : deviceHeight * 0.54;
  const petImagePosition = isLongPhone ? deviceHeight * 0.62 : isMediumPhone ? deviceHeight * 0.6 : deviceHeight * 0.55;
  const heroImageSize = isLongPhone ? 365 : isMediumPhone ? 290 : 265;
  const bottomDrawerHeight = isLongPhone ? deviceHeight / 2.8 : isMediumPhone ? deviceHeight / 2.6 : deviceHeight / 2.4;
  const hero = state.hero as Hero;
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  // Used only to disable the sidebar when the bottom menu is active
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
  const [backgroundAnimation, setBackgroundAnimation] = useState(null);
  const [leveledUp, setLeveledUp] = useState(false);
  const openBottomDrawerFromParent = useRef(null);
  // Only used to force a refresh on the countdown timer
  const [countdownTimerRefreshCount, setCountdownTimerRefreshCount] = useState(0);

  useServerMessage();

  async function handleHeroUpgrade(upgradeResults: UpgradeResults) {
    const { items, rewards, reachedLevel } = upgradeResults;

    setNewActivities([]);

    // Set Background Animation
    if (reachedLevel) {
      setBackgroundAnimation("level-up");
      setLeveledUp(true);
      setTimeout(() => {
        setLeveledUp(false);
      }, 3000);
    } else {
      setBackgroundAnimation("activity-up");
    }

    // If items were found, we need to fetch inventory again and update
    if (items.length || rewards.length) {
      fetchAndUpdateInventory();
    }

    // Builds the Correct message based on returned data from upgrade
    const messageArray = buildGainsMessages(upgradeResults);

    // Show messages via toast
    messageArray.forEach((message: string, i: number) => {
      setTimeout(() => {
        addToast("success", message, 2500, 125);
      }, 3250 * i);
    });
  }

  // ON LOGIN REWARD ALERT (from get-avatar)
  useEffect(() => {
    if (state.awardedItemMessage) {
      addToast("success", state.awardedItemMessage, 4000, 125);
    }
  }, [state.awardedItemMessage]);

  // Determine which modal should pop up
  useEffect(() => {
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

  // CLEAR ACTIVITIES IN STATE
  useEffect(() => {
    if (route.params?.clearActivities) {
      setNewActivities([]);
    }
  }, [route.params?.clearActivities]);

  // STRAVA MANUALLY FETCHED - User Clicked the button to manually fetch data from the Manual page
  useEffect(() => {
    if (route.params?.fetchStravaManually) {
      //console.log("calling manually");
      getFreshStravaData(true);
    }
  }, [route.params?.fetchStravaManually]);

  // POST BATTLE REWARDS
  useEffect(() => {
    const awards = route.params?.postBattleReportAwards;
    if (awards && awards.length) {
      awards.forEach((award: string, i: number) => {
        setTimeout(() => {
          addToast("success", award, 1500, 125);
        }, 3000 * i);
      });
    }
  }, [route.params?.postBattleReportAwards]);
  return (
    <SideMenu disableGestures={(Boolean(state.initialHomescreenLoad) ?? false) || bottomDrawerOpen} bounceBackOnOverdraw={false} onChange={isOpen => setSideDrawerOpen(isOpen)} isOpen={sideDrawerOpen} menuPosition={"right"} menu={<SidebarMenu navigation={navigation} setSideDrawerOpen={setSideDrawerOpen} heroName={hero.name} />} openMenuOffset={sideBarWidth}>
      <ScreenContainer bg={<Background animation={backgroundAnimation} setBackgroundAnimation={setBackgroundAnimation} />} screenName={route.name}>
        <View zIndex={110} elevation={110}>
          <GestureRecognizer
            onSwipeDown={state => {
              getAllAppData().then(data => {
                setCountdownTimerRefreshCount(existingCount => ++existingCount);
                dispatch({ type: "INCREMENT REFRESH COUNT" });
                fetchAndUpdateInventory();
              });
            }}
          >
            {/* TOP SECTION */}
            <View zIndex={110}>
              <TopHud equippedTitle={equippedTitle} refreshCountdownTimer={countdownTimerRefreshCount} />
              {state.isSignedIn && !state.initialHomescreenLoad && <DrawerIndicator setSideDrawerOpen={setSideDrawerOpen} />}
            </View>
            {/* HERO & PET */}
            <View h={heroImagePosition} zIndex={110}>
              <Box position="absolute" bottom={0} left="50%" ml={-(heroImageSize / 2)}>
                <HeroImage width={heroImageSize} height={heroImageSize} skin={equippedSkin} status={hero.status} floating={hero.status === "Knocked Out" ? false : true} character={hero.character} equipped={hero.equipped} alias={hero.alias} />
              </Box>
            </View>
          </GestureRecognizer>
          <Box position="absolute" zIndex={111} right={-5} top={petImagePosition}>
            {equippedPet && <PetImage pet={equippedPet} />}
          </Box>
          {/* Used to display Leveled Up! message */}
          {leveledUp && <LevelUpText deviceHeight={deviceHeight} />}
        </View>
        {/* BOTTOM CONSOLE */}

        <BottomDrawer hero={state.hero} newActivitiesAvailable={newActivities.length > 0 ? true : false} latestBattle={state.latestBattle} user={state.user} setBottomDrawerOpen={setBottomDrawerOpen} bottomDrawerHeight={bottomDrawerHeight} initialDisabledLinks={state.initialHomescreenLoad} openBottomDrawerFromParent={openBottomDrawerFromParent} setBackgroundAnimation={setBackgroundAnimation} />

        {/* MODALS */}
        <SignupToSave id="SignupToSave" modalAction={() => dispatch({ type: "SET INITIAL HOMESCREEN LOAD", payload: { initialHomescreenLoad: "Register" } })} />
        <ConfirmEmail id="ConfirmEmail" />
        <ChooseActivityEntry id="ChooseActivityEntry" getFreshStravaData={getFreshStravaData} />
        <FeedbackChoice id="FeedbackChoice" />
        <SignupFinished id="SignupFinished" />
        <GoToBattle id="GoToBattle" goTo={navigation.push} heroId={hero.id} openBottomDrawerFromParent={() => openBottomDrawerFromParent.current()} />

        <ActivityUpgrade id="ActivityUpgrade" activities={newActivities} modalAction={(upgradeResults: UpgradeResults) => handleHeroUpgrade(upgradeResults)} goBack={(activity: Activity) => navigation.push("Activity", { activity })} closeModal={closeModal} setNewActivities={setNewActivities} />
      </ScreenContainer>
    </SideMenu>
  );
};

export default Home;
