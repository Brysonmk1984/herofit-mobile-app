import { useContext, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import moment from "moment";
// COMMON
import debugErrors from "../../../../../common/debugErrors";
import { GlobalStateContext } from "../../../../../store";
// API
import stravaEndpoints, { STRAVA_REDIRECT_URI } from "./stravaEndpoints";
import { insertStravaCredentials, getStravaClientCredentials } from "../../../../../api/authentication";
import { getStravaUserId } from "../../../../../api/strava";

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
    debugErrors(error);
  }
}

function useStravaConnect() {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [redirectData, setRedirectData] = useState(null);
  const [clientId, setClientId] = useState();
  const [redirectUri, setRedirectUri] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [stravaSuccess, setStravaSuccess] = useState(false);
  // One-Time Strava Auth Request
  const [request, response, promptAsync] = AuthSession.useAuthRequest({ clientId, scopes: ["activity:read_all"], redirectUri: redirectUri || `${STRAVA_REDIRECT_URI}` }, stravaEndpoints);

  async function getStravaCredentials() {
    const { clientId, redirectUri, clientSecret } = await getStravaClientCredentials();
    setClientId(clientId);
    setRedirectUri(redirectUri);
    setClientSecret(clientSecret);
  }

  // When receiving an incoming user back from Strava redirect
  // save data to state
  function handleStravaRedirect(event) {
    console.log("EVENT", typeof event, event);
    if (Constants.platform.ios) {
      WebBrowser.dismissBrowser();
    } else {
      Linking.removeEventListener("url", event);
    }

    const data = Linking.parse(event.url);

    setRedirectData(data);
  }

  // Need to add the seconds until expiration to the now moment in seconds in order to get the expiredAt value for the access token
  function calcAccessTokenExp(expiresIn) {
    const nowEpoch = moment().valueOf() / 1000;
    return nowEpoch + expiresIn;
  }

  // When the data is saved to state from Strava, get new Access token
  useEffect(() => {
    if (redirectData) {
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

        const credentialsForDB = {
          stravaAccessToken: accessToken,
          stravaAccessTokenExpiration: calcAccessTokenExp(expiresIn),
          stravaRefreshToken: refreshToken,
        };
        const { id: dataSrcId } = await getStravaUserId(credentialsForDB.stravaAccessToken);
        // After an updated Strava auth token, refresh token and expiration are fetched, save it to our DB
        _insertUpdatedStravaCredentials(credentialsForDB, state.user.email, dataSrcId, dispatch);
        setStravaSuccess(true);
      })();
    }
  }, [redirectData]);

  return {
    getStravaCredentials,
    handleStravaRedirect,
    request,
    promptAsync,
    stravaSuccess,
  };
}

export default useStravaConnect;
