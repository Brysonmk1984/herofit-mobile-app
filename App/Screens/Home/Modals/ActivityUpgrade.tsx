import React, { useContext, useState } from "react";
import { AppState, FlatList, useWindowDimensions } from "react-native";
import { Text, Box, ScrollView, Link } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { convertSecondsToReadableTime, determineElementFromActivity } from "../../../common/activityCalculations";
import moment from "moment";
import { Activity } from "../../../common/types";
import { ModalActionHeader } from "../../../Components/ModalTemplates/ModalActionHeader";
import Icon from "../../../Components/Icon";
import customIconActivityTypes from "../../../common/customIconActivityTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../../common/types-navigator";
import { UpgradeResults, upgradeSequence } from "../../../api/avatar";
import { GlobalStateContext } from "../../../store";
import debugErrors from "../../../common/debugErrors";
import { clearLs } from "../../../common/helperFunctions";
import useGlobalToast from "../../../common/hooks/useGlobalToast";
import LoadingInPane from "../../../Components/LoadingInPane";

interface ActivityUpgradeProps {
  id: string;
  activities: Activity[];
  modalAction: (upgradeResults: UpgradeResults) => void;
  state: AppState;
  goBack: (activity: Activity) => void;
  closeModal: () => void;
  setNewActivities: ([]: []) => void;
}

const ActivityUpgrade: React.FC<ActivityUpgradeProps> = ({ id, activities, modalAction, goBack, closeModal, setNewActivities }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { addToast } = useGlobalToast();
  const windowHeight = useWindowDimensions().height;
  const [loading, setLoading] = useState(false);

  function renderListItem({ activityDate, type, duration }) {
    const color = `base.${determineElementFromActivity(type)}`;
    return (
      <Box mt={3} justifyContent="center" flexDirection="row">
        <Icon iconName={type} size={customIconActivityTypes.includes(type) ? 25 : 6} color={color} />
        <Text pl={2} fontFamily="heading" color="primary.500" fontSize="lg">
          {`${moment(activityDate).format("MM/DD - hh:mm a")}`}:
        </Text>
        <Text px={2} fontFamily="heading" fontSize="lg">
          {convertSecondsToReadableTime(duration)}
        </Text>
        <Text fontFamily="heading" color={color} fontSize="lg">
          {type}
        </Text>
      </Box>
    );
  }

  function handleBackToActivities() {
    closeModal();
    setNewActivities([]);
    setTimeout(() => {
      goBack(activities[0]);
    }, 500);
  }

  async function handleSubmitActivity() {
    try {
      setLoading(true);
      // INSERT ACTIVITIES, UPDATE USER TOTALS, BUF AVATAR
      const upgradeResults = await upgradeSequence({ email: state.user.email, activities, accountDate: state.user.createdAt, hasBeenUpgraded: state.hero.hasBeenUpgraded });

      // combine returned avatar with existing equipped items... backend not fetching equipment here
      const heroEquipped = Object.assign({}, state.hero, upgradeResults.avatar, { equipped: state.hero.equipped });

      const maxDate = moment.max(activities.map(act => moment(act.activityDate)));
      //console.log("max data", maxDate, maxDate.local(), upgradeResults.activities.length);
      dispatch({ type: "POST UPGRADE", payload: { hero: heroEquipped, latestSavedActivities: upgradeResults.activities, latestSavedActivityDate: maxDate } });
      setLoading(false);
      // Return upgradeResults to homepage for setting state there
      modalAction(upgradeResults);
    } catch (error) {
      // Errors not reaching here for some reason
      if (error?.meta === "Error: Duplicate Activity Entry, couldn't update Hero!") {
        error.message = error.meta;
      } else {
        error.message = "Couldn't upgrade hero, please try again later.";
      }
      setLoading(false);
      // clear out any activities locally
      clearLs("herofit-stravaActivities");
      setNewActivities([]);
      addToast("error", error.message, undefined, 125);
      debugErrors(error, state.user);
    }
  }

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech={`Masterful form, young ${state.hero.name}! I see you've been working out. Keep it up and the Dark Forces will be no match for you`} buttonText="Upgrade" modalAction={handleSubmitActivity} disabled={loading}>
      <ModalActionHeader type="info" text="You've been working out!" />
      <BodyContent>
        <ScrollView maxHeight={windowHeight * 0.3} minHeight={windowHeight * 0.08}>
          <FlatList data={activities} renderItem={({ item }) => renderListItem(item)} keyExtractor={(item, index) => item.id?.toString() || index.toString()} />
        </ScrollView>
        {loading && <LoadingInPane />}
        {activities.length === 1 && activities[0].source === "herofit" && !loading && (
          <Link justifyContent="center" onPress={handleBackToActivities} mt={8} mb={4}>
            Back to Activity
          </Link>
        )}
      </BodyContent>
    </CharacterModal>
  );
};

export default ActivityUpgrade;
