import React, { useState } from "react";
import { Box, Button } from "native-base";
import { clearLs } from "../../common/helperFunctions";
import Pane from "../../Components/Pane";
import Subheader from "../../Components/Subheader";
import PaneSupportText from "../../Components/PaneSupportText";
import LoadingInPane from "../../Components/LoadingInPane";

interface StravaPaneProps {
  dispatch: React.Dispatch<AppAction>;
  activityRecheckHappened: boolean;
  pop: (count?: number) => void;
}

const StravaPane: React.FC<StravaPaneProps> = ({ dispatch, activityRecheckHappened, pop }) => {
  const [loading, setLoading] = useState(false);
  function handleCheckStrava() {
    setLoading(true);
    dispatch({ type: "SET ACTIVITY RECHECK HAPPENED", payload: { activityRecheckHappened: true } });
    setTimeout(() => {
      setLoading(false);
      return pop();
    }, 1000);
  }

  return (
    <Pane mb={280}>
      <Subheader fontSize="2xl" text="Strava" />
      <Box pb={7} mb={7}>
        <PaneSupportText iconName="info" iconColor="base.info" text="Missing an activity recorded on Strava? Check for new activities:">
          Data is fetched automatically after the app is opened. You can manually check for new activities below:
        </PaneSupportText>
        {loading && <LoadingInPane text="Fetching Strava Data..." />}
        <Button disabled={activityRecheckHappened} bgColor={activityRecheckHappened ? "base.disabled" : "base.success"} _text={{ fontFamily: "heading", fontSize: "4xl", lineHeight: 45, color: activityRecheckHappened ? "muted.500" : "base.white" }} mt={5} onPress={() => handleCheckStrava()}>
          CHECK STRAVA
        </Button>
      </Box>
    </Pane>
  );
};

export default StravaPane;
