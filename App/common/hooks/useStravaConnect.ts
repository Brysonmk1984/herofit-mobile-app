import { useContext, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
// COMMON
import debugErrors from "../debugErrors";
import { GlobalStateContext } from "../../store";

// API
import stravaEndpoints from "../../Screens/Home/Modals/ChooseActivityEntry/Strava/stravaEndpoints";
import { getStravaClientCredentials } from "../../api/authentication";
import { stravaFirstTimeAuthCodeExchange } from "../../api/strava";
import useGlobalToast from "./useGlobalToast";
import { makeRedirectUri } from "expo-auth-session";
const ENV: string = Constants.manifest.extra.ENV;

interface StravaConnectReturn {
  clientId: string | null;
  request: AuthSession.AuthRequest;
  promptAsync: (options?: AuthSession.AuthRequestPromptOptions) => Promise<AuthSession.AuthSessionResult>;
  stravaSuccess: boolean;
  setStravaSuccess: (stravaSuccess: boolean) => void;
  helperText: string;
}

function useStravaConnect(): StravaConnectReturn {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [clientId, setClientId] = useState(null);
  const [stravaSuccess, setStravaSuccess] = useState(false);
  const [helperText, setHelperText] = useState<string | null>(null);

  const { addToast } = useGlobalToast();

  // Connecting Strava requires fetching the client ID from the server
  async function _getStravaCredentials() {
    try {
      // Only attempt to get strava credentials if user is active
      if (state.user?.active) {
        const { clientId, redirectUri } = await getStravaClientCredentials();
        setClientId(clientId);
      }
    } catch (error) {
      debugErrors(error);
      throw error;
    }
  }

  // One-Time Strava Auth Request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ["activity:read_all"],
      redirectUri:
        ENV === "development"
          ? "exp://redirect"
          : makeRedirectUri({
              // For usage in bare and standalone
              native: "herofit://redirect",
              useProxy: false,
            }),
    },
    stravaEndpoints,
  );

  // Handle response from connecting Strava
  function _handleStravaResponse(response) {
    setHelperText("Trying to Connect Strava...");

    if (Constants.platform.ios) {
      WebBrowser.dismissBrowser();
    } else {
      Linking.removeEventListener("url", response);
    }

    if (response.url && response.params.scope.includes("read_all")) {
      const redirectData = Linking.parse(response.url);
      (async () => {
        try {
          const { user } = await stravaFirstTimeAuthCodeExchange({ email: state.user.email, authCode: redirectData.queryParams.code });
          dispatch({ type: "SET USER", payload: { user, isSignedIn: true } });
          setStravaSuccess(true);
          setHelperText(null);
          addToast("success", "Strava Account Successfully Connected!", undefined);
        } catch (error) {
          debugErrors(error);
          setHelperText(null);
          const errorMessage = error?.debug[0] === "SequelizeUniqueConstraintError: Validation error" ? "Strava account is already in use, can't use twice!" : error.message;
          addToast("error", errorMessage, undefined);
        }
      })();
    } else {
      setHelperText(null);
    }
  }

  // Handle Response from Strava Authorization
  useEffect(() => {
    if (response) {
      _handleStravaResponse(response);
    }
  }, [response]);

  // Fetch clientId from server
  useEffect(() => {
    if (state.user?.active) {
      _getStravaCredentials();
    }
  }, [state.user?.active]);

  return {
    clientId,
    request,
    promptAsync,
    stravaSuccess,
    setStravaSuccess,
    helperText,
  };
}

export default useStravaConnect;
