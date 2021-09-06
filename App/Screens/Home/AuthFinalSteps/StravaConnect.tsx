import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button } from "native-base";
import { handleStravaDetails } from "./AuthFlow";
import { getStravaClientCredentials } from "../../../api/authentication";
WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://www.strava.com/oauth/mobile/authorize",
  tokenEndpoint: "https://www.strava.com/oauth/token",
  revocationEndpoint: "https://www.strava.com/oauth/deauthorize",
};

export default function StravaConnect({ email }) {
  const [clientId, setClientId] = useState();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ["activity:read_all"],
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        // the "redirect" must match your "Authorization Callback Domain" in the Strava dev console.
        //native: "your.app://redirect",
        useProxy: false,
        native: "herofit.io",
      }),
    },
    discovery,
  );

  useEffect(() => {
    console.log("RESPONSE", response);
    if (response?.type === "success") {
      const { code } = response.params;
    }
  }, [response]);

  useEffect(() => {
    (async () => {
      const { clientId, clientSecret } = await getStravaClientCredentials();
      setClientId(clientId);

      const cake = makeRedirectUri({
        // For usage in bare and standalone
        // the "redirect" must match your "Authorization Callback Domain" in the Strava dev console.
        //native: "your.app://redirect",
        native: "herofit.io",
        useProxy: false,
      });
      console.log("CAKE", cake);
    })();
  }, []);

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
