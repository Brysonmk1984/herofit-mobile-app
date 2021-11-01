import { useContext, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import moment from "moment";
// COMMON
import debugErrors from "../../../../../common/debugErrors";
import { GlobalStateContext } from "../../../../../store";
import useAxios from "../../../../../common/hooks/useAxios";
// API
import stravaEndpoints, { STRAVA_REDIRECT_URI } from "./stravaEndpoints";
import { insertStravaCredentials, getStravaClientCredentials } from "../../../../../api/authentication";
import { getStravaUserId } from "../../../../../api/strava";
import useGlobalToast from "../../../../../common/hooks/useGlobalToast";
import { makeRedirectUri } from "expo-auth-session";
import { Alert } from "react-native";

// For Web Only
//WebBrowser.maybeCompleteAuthSession();

interface StravaCredentials {
  stravaAccessToken: string;
  stravaAccessTokenExpiration: number;
  stravaRefreshToken: string;
}
async function _insertUpdatedStravaCredentials(credentialsForDB: StravaCredentials, email: string, dataSrcId: string, dispatch: React.Dispatch<any>) {
  try {
    // Insert user-specific Strava credentials into our db
    const { user } = await insertStravaCredentials({ ...credentialsForDB, dataSrcId, email });
    dispatch({ type: "SET USER", payload: { user, isSignedIn: true } });
  } catch (error) {
    if (error.debug[0].msg === "SequelizeUniqueConstraintError: Validation error") {
      error.message = "Strava Account already in use. Sharing Strava accounts among heroes is not permitted within HeroFit";
    }
    throw error;
  }
}

function useStravaConnect() {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [redirectData, setRedirectData] = useState(null);
  const [hasFetchedStravaDetails, setHasFetchedStravaDetails] = useState(false);
  const [clientId, setClientId] = useState();
  const [redirectUri, setRedirectUri] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [stravaSuccess, setStravaSuccess] = useState(false);
  const [helperText, setHelperText] = useState<string | null>(null);
  const [data, loading, error] = useAxios(null, null, false, null);
  const { addToast } = useGlobalToast();
  // One-Time Strava Auth Request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ["activity:read_all"],
      //redirectUri: redirectUri || `${STRAVA_REDIRECT_URI}`,
      redirectUri,
      // !!!For usage in bare and standalone
      // the "redirect" must match your "Authorization Callback Domain" in the Strava dev console.
      //redirectUri: makeRedirectUri({ native: "herofit://redirect", useProxy: false }),
    },
    stravaEndpoints,
  );

  async function getStravaCredentials() {
    try {
      const { clientId, redirectUri, clientSecret } = await getStravaClientCredentials();
      setClientId(clientId);
      setRedirectUri(redirectUri);
      setClientSecret(clientSecret);
    } catch (error) {
      debugErrors(error);
      throw error;
    }
  }

  // When receiving an incoming user back from Strava redirect
  // save data to state
  function handleStravaRedirect(event) {
    if (Constants.platform.ios) {
      WebBrowser.dismissBrowser();
    } else {
      Linking.removeEventListener("url", event);
    }

    const data = Linking.parse(event.url);

    Alert.alert("Redirect Data", `data - ${data}`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

    setRedirectData(data);
  }

  // Need to add the seconds until expiration to the now moment in seconds in order to get the expiredAt value for the access token
  function calcAccessTokenExp(expiresIn) {
    const nowEpoch = moment().valueOf() / 1000;
    return nowEpoch + expiresIn;
  }

  // When the data is saved to state from Strava, get new Access token
  useEffect(() => {
    // Only attempt fetch if there is redirect data AND detaisl have not been fetched yet
    if (redirectData && !hasFetchedStravaDetails) {
      (async () => {
        const { accessToken, refreshToken, expiresIn } = await AuthSession.exchangeCodeAsync(
          {
            clientId: request.clientId,
            redirectUri,
            code: redirectData.queryParams.code,
            extraParams: {
              // You must use the extraParams variation of clientSecret.
              // Never store your client secret on the client.
              client_secret: clientSecret,
            },
          },
          { tokenEndpoint: stravaEndpoints.tokenEndpoint },
        );
        if (accessToken && refreshToken && expiresIn) {
          setHasFetchedStravaDetails(true);
        }

        const credentialsForDB = {
          stravaAccessToken: accessToken,
          stravaAccessTokenExpiration: calcAccessTokenExp(expiresIn),
          stravaRefreshToken: refreshToken,
        };
        try {
          setHelperText("Trying to Connect Strava...");
          const { id: dataSrcId } = await getStravaUserId(credentialsForDB.stravaAccessToken);
          // After an updated Strava auth token, refresh token and expiration are fetched, save it to our DB
          await _insertUpdatedStravaCredentials(credentialsForDB, state.user.email, dataSrcId, dispatch);
          setStravaSuccess(true);
          setHelperText(null);
        } catch (error) {
          debugErrors(error);

          setHelperText(error.message);
        }
      })();
    }

    // TODO: Figure out how to write cleanup function for this
    //return () => ()
  }, [redirectData]);

  return {
    getStravaCredentials,
    handleStravaRedirect,
    request,
    promptAsync,
    stravaSuccess,
    helperText,
    setHasFetchedStravaDetails,
  };
}

export default useStravaConnect;
