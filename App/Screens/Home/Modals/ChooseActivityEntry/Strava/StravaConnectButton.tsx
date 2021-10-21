import React, { useEffect, useState } from "react";
import { Button } from "native-base";

interface StravaConnectButton {
  request: object;
  promptAsync: () => void;
  setHasFetchedStravaDetails: (bool: boolean) => void;
}

export default function StravaConnectButton({ request, promptAsync, setHasFetchedStravaDetails }: StravaConnectButton) {
  const [disabled, setDisabled] = useState(true);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  useEffect(() => {
    if (request && !hasBeenClicked) {
      setTimeout(() => {
        setDisabled(false);
      }, 1000);
    }
  }, [request, hasBeenClicked]);

  return (
    <Button
      mb={3}
      bgColor="base.strava"
      disabled={disabled}
      onPress={() => {
        setHasBeenClicked(true);

        promptAsync();
        // In case a user needs to reclick the Strava button
        setHasFetchedStravaDetails(false);
      }}
    >
      Connect Strava
    </Button>
  );
}
