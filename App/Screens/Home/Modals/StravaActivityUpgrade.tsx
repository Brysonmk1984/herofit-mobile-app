import React, { useContext } from "react";
import { FlatList } from "react-native";
import { Heading, Text, Box } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { convertSecondsToReadableTime } from "../../../common/activityCalculations";
import { GlobalStateContext } from "../../../store";
import moment from "moment";
import { Activity } from "../../../common/types";

interface StravaActivityUpgradeProps {
  id: string;
  activities: Activity[];
}

export const StravaActivityUpgrade: React.FC<StravaActivityUpgradeProps> = ({ id, activities }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  console.log("ACTS=", activities);
  function renderListItem({ activityDate, type, duration }) {
    return (
      <Box flexDirection="row">
        <Text fontFamily="heading" color="primary.500">
          {`\u2022 ${moment(activityDate).format("MM/DD : hh:mm a")} ${type}`}:
        </Text>
        <Text fontFamily="heading">{convertSecondsToReadableTime(duration)}</Text>
      </Box>
    );
  }

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech={`Masterful form, young ${state.hero.name}! I see you've been working out. Keep it up and the Dark Forces will be no match for you`} buttonText="Upgrade">
      <ActionHeader type="info" text="You've been working out!" />
      <BodyContent>
        <FlatList data={activities} renderItem={({ item }) => renderListItem(item)} keyExtractor={item => item.id} />
      </BodyContent>
    </CharacterModal>
  );
};
