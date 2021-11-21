import React from "react";
import { Button } from "native-base";

interface StravaConnectButton {
  disable: boolean;
  promptAsync: () => void;
}

const StravaConnectButton: React.FC<StravaConnectButton> = ({ disable, promptAsync }) => {
  return (
    <Button
      mb={3}
      disabled={disable}
      bgColor={disable ? "base.disabled" : "base.strava"}
      _text={{ color: disable ? "muted.500" : "base.white" }}
      onPress={() => {
        promptAsync();
      }}
    >
      Connect Strava
    </Button>
  );
};

export default StravaConnectButton;
