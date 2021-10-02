import React, { useContext, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { View, Button, Box, useTheme } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import Triangle from "../Triangle";
import StatDisplay from "../../../../../Components/StatDisplay";
import { useNavigation } from "@react-navigation/native";
import { PtAndQpMenu } from "./PtAndQpMenu";
import { Activity, Item } from "../../../../../common/types";
import { StravaActivityUpgrade } from "../../StravaActivityUpgrade";
import useModal from "../../../../../common/hooks/useModal";
import { GlobalStateContext } from "../../../../../store";
import { upgradeSequence } from "../../../../../api/avatar";
import { updateAlerts } from "../../../../../common/alerts";
import debugErrors from "../../../../../common/debugErrors";
import { buildGainsMessages, displayGainsMessages } from "./gainsMessages";
import useStravaDataProcess from "../../../useStravaDataProcess";
import moment from "moment";

interface BottomDrawerProps {
  power: number;
  recovery: number;
  armor: number;
  fire: number;
  earth: number;
  water: number;
  air: number;
  aether: number;
  photonTokens: number;
  qp: number;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ power, recovery, armor, fire, earth, water, air, aether, photonTokens, qp }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const bottomDrawerHeight = windowHeight / 2.75;
  const refRBSheet = useRef({ open: () => null });
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { openModal } = useModal();
  const { newStravaActivities } = useStravaDataProcess();
  const [newActivities, setNewActivities] = useState<Activity[]>([]);

  async function handleHeroUpgrade(activities: Activity[]) {
    console.log("HERE", activities);
    const user = state.user;
    try {
      // INSERT ACTIVITIES, UPDATE USER TOTALS, BUF AVATAR
      const upgradeResults = await upgradeSequence({ email: user.email, activities, accountDate: user.createdAt, hasBeenUpgraded: state.hero.hasBeenUpgraded });

      // combine returned avatar with existing equipped items... backend not fetching equipment here
      const heroEquipped = Object.assign({}, state.hero, upgradeResults.avatar, { equipped: state.hero.equipped });

      const maxDate = moment.max(activities.map(act => moment(act.activityDate)));
      console.log("THE MAX DATE", maxDate);
      dispatch({ type: "POST UPGRADE", payload: { hero: heroEquipped, latestSavedActivities: [...state.latestSavedActivities, ...upgradeResults.activities], latestSavedActivityDate: maxDate } });
      setNewActivities([]);
      // Builds the Correct message based on returned data from upgrade
      const messageArray = buildGainsMessages(upgradeResults);
      console.log("THE MESSAGESSS", messageArray);
      // Displays messages to user via in-app alerts
      displayGainsMessages(messageArray, alert => updateAlerts(alert, state, dispatch));

      //return { data: { leveledUp: upgradeResults.reachedLevel ? true : false } };
    } catch (error) {
      error.message = "Couldn't upgrade hero, please try again later.";

      updateAlerts([{ type: "error", message: error.message }], dispatch, state);
      debugErrors(error, user);
    }
  }

  // Automatic Activity Data fetching
  useEffect(() => {
    // For new users, newStravaActivities is undefined, otherwise it's an array
    if (newStravaActivities && newStravaActivities.length) {
      console.log("!!!!", newStravaActivities);
      setNewActivities(newStravaActivities);
    }
  }, [newStravaActivities]);

  return (
    <Box position="absolute" bottom={0}>
      {/* PT & QP */}
      <PtAndQpMenu photonTokens={photonTokens} qp={qp} windowWidth={windowWidth} />
      {/* ACTIVITY & BATTLE */}
      <Box>
        <Box alignItems="center">
          <Triangle action={() => refRBSheet.current.open()} />
        </Box>

        <Box borderTopColor="primary.800" borderTopWidth={1} display="flex" flexDirection="row" backgroundColor="base.primary">
          <Box w="50%" p={2} borderRightWidth={1} borderRightColor="primary.800">
            <Button bgColor={newActivities.length ? "base.highlight" : null} onPress={() => (newActivities.length ? openModal("StravaActivityUpgrade") : navigation.push("App", { screen: "ManualActivity" }))} _text={{ fontFamily: "heading", fontSize: 30 }} borderRadius="0px">
              Activity
            </Button>
          </Box>
          <Box w="50%" p={2}>
            <Button _text={{ fontFamily: "heading", fontSize: 30 }} borderRadius={0}>
              Battle
            </Button>
          </Box>
        </Box>
      </Box>
      {/* HIDDEN MENU */}
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor="#000">
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={bottomDrawerHeight}
          openDuration={750}
          customStyles={{
            wrapper: {
              backgroundColor: "transparent",
            },
            container: {
              backgroundColor: colors.base.primary,
            },
            draggableIcon: {
              backgroundColor: "#f1c85b",
            },
          }}
        >
          <Box flexDirection="row">
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Power" value={power} reversedText size="sm" />
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Recovery" value={recovery} reversedText size="sm" />
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Armor" value={armor} reversedText size="sm" />
            {aether > 0 ? <StatDisplay flex={1} stat="Aether" value={aether} reversedText size="sm" /> : null}
          </Box>
          <Box display="flex" flexDirection="row">
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Fire" value={fire} reversedText size="sm" />
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Earth" value={earth} reversedText size="sm" />
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Water" value={water} reversedText size="sm" />
            <StatDisplay flex={1} statColor={colors.base.highlight} stat="Air" value={air} reversedText size="sm" />
          </Box>
          <Box flexDirection="row">
            <Button m={1} flex={1}>
              Inventory
            </Button>
            <Button m={1} flex={1}>
              Profile
            </Button>
            <Button m={1} flex={1}>
              Campaign
            </Button>
          </Box>
        </RBSheet>
      </View>
      {/* Modals */}
      <StravaActivityUpgrade id="StravaActivityUpgrade" activities={newActivities} modalAction={() => handleHeroUpgrade(newActivities)} state={state} />
    </Box>
  );
};

export default BottomDrawer;
