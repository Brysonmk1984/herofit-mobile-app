import React, { useContext } from "react";
import { Box, Center, FlatList, HStack, Link, Text } from "native-base";
import Pane from "../../Components/Pane";
import Subheader from "../../Components/Subheader";
import { GlobalStateContext } from "../../store";
import PaneSupportText from "../../Components/PaneSupportText";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../common/types-navigator";
import ActivityDetail from "./ActivityDetail";
import ListHeaderComponent from "./ListHeaderComponent";
import moment from "moment";

interface HistoryPaneProps {
  navigation: StackNavigationProp<MainStackParamList, "Activity">;
  isStravaUser: boolean;
}

const HistoryPane: React.FC<HistoryPaneProps> = ({ navigation, isStravaUser }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { latestSavedActivities } = state;

  const orderedActivities = latestSavedActivities.sort((a, b) => (moment(a.activityDate).isAfter(moment(b.activityDate)) ? -1 : 1)).slice(0, 10);

  return (
    <Pane mb={10}>
      <Subheader fontSize="2xl" text="Latest Activities" />
      {orderedActivities.length === 0 && (
        <PaneSupportText iconName="info" iconColor="base.info" text="No activity recorded - yet ;) ">
          {isStravaUser ? (
            "Manually add an activity above, or record an activity on the Strava App to begin leveling up!"
          ) : (
            <HStack pt={5}>
              <Text color="primary.700">Manually add an activity above, or </Text>
              <Link onPress={() => navigation.push("Settings")}>Connect Strava.</Link>
            </HStack>
          )}
        </PaneSupportText>
      )}
      {orderedActivities.length > 0 && <FlatList ListHeaderComponent={() => <ListHeaderComponent />} data={orderedActivities} renderItem={item => <ActivityDetail activity={item.item} />} />}
    </Pane>
  );
};

export default HistoryPane;
