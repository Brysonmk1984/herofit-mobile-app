import React from "react";
import { AppState, FlatList, useWindowDimensions } from "react-native";
import { Text, Box, ScrollView, Link } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { convertSecondsToReadableTime, determineElementFromActivity } from "../../../common/activityCalculations";

import moment from "moment";
import { Activity } from "../../../common/types";
import { ModalActionHeader } from "../../../Components/ModalTemplates/ModalActionHeader";
import Icon from "../../../Components/Icon";

interface ActivityUpgradeProps {
  id: string;
  activities: Activity[];
  modalAction: () => void;
  state: AppState;
  goBack: (navigator: string, options: { screen: string }) => void;
  closeModal: () => void;
  setNewActivities: ([]: []) => void;
}

const ActivityUpgrade: React.FC<ActivityUpgradeProps> = ({ id, activities, modalAction, state, goBack, closeModal, setNewActivities }) => {
  const windowHeight = useWindowDimensions().height;
  function renderListItem({ activityDate, type, duration }) {
    const color = `base.${determineElementFromActivity(type)}`;
    return (
      <Box mt={3} justifyContent="center" flexDirection="row">
        <Icon iconName={type} size={25} color={color} />
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
    setNewActivities([]);
    goBack("Activity");
    closeModal();
  }

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech={`Masterful form, young ${state.hero.name}! I see you've been working out. Keep it up and the Dark Forces will be no match for you`} buttonText="Upgrade" modalAction={modalAction}>
      <ModalActionHeader type="info" text="You've been working out!" />
      <BodyContent>
        <ScrollView maxHeight={windowHeight * 0.3} minHeight={windowHeight * 0.08}>
          <FlatList data={activities} renderItem={({ item }) => renderListItem(item)} keyExtractor={(item, index) => item.id?.toString() || index.toString()} />
        </ScrollView>

        {activities.length === 1 && activities[0].source === "herofit" && (
          <Link justifyContent="center" onPress={handleBackToActivities} mt={8} mb={4}>
            Back to Activity
          </Link>
        )}
      </BodyContent>
    </CharacterModal>
  );
};

export default ActivityUpgrade;
