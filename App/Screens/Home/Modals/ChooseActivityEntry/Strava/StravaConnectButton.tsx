import React, { useEffect, useState } from "react";
import { Button } from "native-base";

interface StravaConnectButton {
  request: object;
  promptAsync: () => void;
}

export default function StravaConnectButton({ request, promptAsync }: StravaConnectButton) {
  const [disabled, setDisabled] = useState(true);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  useEffect(() => {
    if (request && !hasBeenClicked) {
      setTimeout(() => {
        setDisabled(false);
      }, 1500);
    }
  }, [request, hasBeenClicked]);

  return (
    <Button
      backgroundColor="base.strava"
      disabled={disabled}
      onPress={() => {
        setHasBeenClicked(true);
        promptAsync();
      }}
    >
      Connect Strava
    </Button>
  );
}
