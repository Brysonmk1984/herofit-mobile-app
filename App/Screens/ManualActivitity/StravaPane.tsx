import React, { useState } from "react";
import { Box, Button } from "native-base";
import { clearLs } from "../../common/helperFunctions";
import Pane from "../../Components/Pane";
import Subheader from "../../Components/Subheader";
import { PaneSupportText } from "../../Components/PaneSupportText";
import LoadingInPane from "../../Components/LoadingInPane";

interface StravaPaneProps {
  pop: (count?: number) => void;
}

const StravaPane: React.FC<StravaPaneProps> = ({ pop }) => {
  const [hasManuallyChecked, setHasManuallyChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  function handleCheckStrava() {
    setLoading(true);
    setHasManuallyChecked(true);
    setTimeout(() => {
      setLoading(false);
      return pop();
    }, 1000);
  }

  // TODO: Figure out why nammually checked flag resets when page is revisted

  return (
    <Pane mb={280}>
      <Subheader fontSize="2xl" text="Strava" />
      <Box pb={7} mb={7} borderBottomWidth={1} borderBottomColor="white">
        <PaneSupportText iconName="info" iconColor="base.info" text="Missing an activity recorded on Strava? Check for new activities:">
          Data is fetched automatically after the app is opened. You can manually check for new activities below:
        </PaneSupportText>
        {setHasManuallyChecked && loading && <LoadingInPane text="Fetching Strava Data..." />}
        <Button disabled={hasManuallyChecked} bgColor={hasManuallyChecked ? "base.disabled" : "base.success"} _text={{ fontFamily: "heading", fontSize: "4xl", lineHeight: 45, color: hasManuallyChecked ? "muted.500" : "base.white" }} mt={5} onPress={() => handleCheckStrava()}>
          CHECK STRAVA
        </Button>
      </Box>

      {/* <Box>
        <PaneSupportText iconName="caution" iconColor="base.caution" text="Connect or Disconnect Strava Account.">
          Disconnecting Strava won't impact your existing activities or Hero This is useful if you want to assign your Strava account to another Hero.
        </PaneSupportText>
        <Button bgColor={!formIsValid ? "base.disabled" : "base.success"} _text={{ fontFamily: "heading", fontSize: "4xl", lineHeight: 45, color: !formIsValid ? "muted.500" : "base.white" }} mt={5} disabled={!formIsValid} onPress={() => handleSubmit(activity, date, duration, distance, speed)}>
          Disconnect Strava
        </Button>
      </Box> */}
    </Pane>
  );
};

export default StravaPane;
