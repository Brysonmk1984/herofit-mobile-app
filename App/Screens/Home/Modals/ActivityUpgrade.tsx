import React from "react";
import { AppState, FlatList, useWindowDimensions } from "react-native";
import { Text, Box, ScrollView } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { convertSecondsToReadableTime } from "../../../common/activityCalculations";

import moment from "moment";
import { Activity } from "../../../common/types";

interface ActivityUpgradeProps {
  id: string;
  activities: Activity[];
  modalAction: () => void;
  state: AppState;
}

const ActivityUpgrade: React.FC<ActivityUpgradeProps> = ({ id, activities, modalAction, state }) => {
  const windowHeight = useWindowDimensions().height;
  function renderListItem({ activityDate, type, duration }) {
    return (
      <Box justifyContent="center" flexDirection="row">
        <Text fontFamily="heading" color="primary.500">
          {`\u2022 ${moment(activityDate).format("MM/DD - hh:mm a")}`}:
        </Text>
        <Text px={3} fontFamily="heading" color="base.highlight">
          {type}
        </Text>
        <Text fontFamily="heading">{convertSecondsToReadableTime(duration)}</Text>
      </Box>
    );
  }

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech={`Masterful form, young ${state.hero.name}! I see you've been working out. Keep it up and the Dark Forces will be no match for you`} buttonText="Upgrade" modalAction={modalAction}>
      <ActionHeader type="info" text="You've been working out!" />
      <BodyContent>
        <ScrollView maxHeight={windowHeight * 0.3}>
          <Text mb={3} textAlign="center">
            Apply these activities to {state.hero.name}?
          </Text>
          <FlatList data={activities} renderItem={({ item }) => renderListItem(item)} keyExtractor={(item, index) => item.id?.toString() || index.toString()} />
        </ScrollView>
      </BodyContent>
    </CharacterModal>
  );
};

export default ActivityUpgrade;
