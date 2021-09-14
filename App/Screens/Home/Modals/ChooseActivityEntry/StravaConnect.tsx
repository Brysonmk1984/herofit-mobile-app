import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button } from "native-base";
import { handleStravaDetails } from "../../AuthFinalSteps/AuthFlow";
import { getStravaClientCredentials } from "../../../../api/authentication";
// Only needed because useAuthRequest needs an initial value for redirectUri
import Constants from "expo-constants";
const REDIRECT_URI: string = Constants.manifest.extra.APP_STRAVA_REDIRECT_URI;

// For Web Only
//WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://www.strava.com/oauth/mobile/authorize",
  tokenEndpoint: "https://www.strava.com/oauth/token",
  revocationEndpoint: "https://www.strava.com/oauth/deauthorize",
};

export default function StravaConnect({ email }) {
  const [clientId, setClientId] = useState();
  const [redirectUri, setRedirectUri] = useState(null);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ["activity:read_all"],
      redirectUri: redirectUri || `${REDIRECT_URI}`,
      // redirectUri: makeRedirectUri({
      //   // For usage in bare and standalone
      //   // the "redirect" must match your "Authorization Callback Domain" in the Strava dev console.
      //   //native: "your.app://redirect",
      //   //useProxy: true,
      //   //"https://herofitgame.com"
      // }),
      // redirectUri: makeRedirectUri({
      //   useProxy: false,
      //   native: "herofit://redirect",
      // }),
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
      const { clientId, redirectUri } = await getStravaClientCredentials();
      console.log("CI", clientId);
      setClientId(clientId);
      setRedirectUri(redirectUri);
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
