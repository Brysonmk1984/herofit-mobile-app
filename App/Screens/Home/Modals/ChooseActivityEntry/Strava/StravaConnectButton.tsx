import React from "react";
import { Button } from "native-base";

interface StravaConnectButton {
  request: object;
  promptAsync: () => void;
}

export default function StravaConnectButton({ request, promptAsync }: StravaConnectButton) {
  return (
    <Button
      backgroundColor="base.strava"
      disabled={!request}
      onPress={() => {
        promptAsync();
      }}
    >
      Connect Strava
    </Button>
  );
}
