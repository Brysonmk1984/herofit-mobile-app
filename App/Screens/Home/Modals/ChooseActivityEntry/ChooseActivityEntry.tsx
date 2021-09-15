import React, { useContext, useEffect, useState } from "react";
import { Text } from "native-base";
import { ActivityEntrySelect } from "./ActivityEntrySelect";
import StravaConnectButton from "./StravaConnectButton";
import { CharacterModal } from "../../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../../store";
import { createManualDataSrcId, getStravaClientCredentials, insertStravaCredentials } from "../../../../api/authentication";
import debugErrors from "../../../../common/debugErrors";
import useModal from "../../../../common/hooks/useModal";
import stravaEndpoints, { STRAVA_REDIRECT_URI } from "./stravaEndpoints";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
// Only needed because useAuthRequest needs an initial value for redirectUri
import { useAuthRequest } from "expo-auth-session";
import Constants from "expo-constants";
import moment from "moment";
import { getStravaUserId } from "../../../../api/strava";

// For Web Only
//WebBrowser.maybeCompleteAuthSession();

interface ChooseActivityEntryProps {
  id: string;
}

// SELECT ACTIVITY ENTRY MODE
const ChooseActivityEntry: React.FC<ChooseActivityEntryProps> = ({ id }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const [activityRadioValue, setActivityRadioValue] = useState(null);
  const [confirmButton, setConfirmButton] = useState({ modalAction: () => {}, buttonText: "Done" });
  // STRAVA
  const [redirectData, setRedirectData] = useState(null);
  const [clientId, setClientId] = useState();
  const [redirectUri, setRedirectUri] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  async function handleManualDetails(email: string) {
    try {
      const { user } = await createManualDataSrcId({ email });

      dispatch({ type: "SET USER", payload: { user, isSignedIn: true } });
      closeModal("ChooseActivityEntry");
      openModal("SignupFinished");
    } catch (error) {
      debugErrors(error, state.user);
    }
  }

  function _handleRedirect(event) {
    if (Constants.platform.ios) {
      WebBrowser.dismissBrowser();
    } else {
      Linking.removeEventListener("url", _handleRedirect);
    }

    let data = Linking.parse(event.url);
    setRedirectData(data);
  }

  // FETCH STRAVA APP CLIENT DETAILS FROM DB
  async function fetchStravaAppCredentials() {
    const { clientId, redirectUri, clientSecret } = await getStravaClientCredentials();
    console.log("CI", clientId, clientSecret, redirectUri);
    setClientId(clientId);
    setRedirectUri(redirectUri);
    setClientSecret(clientSecret);
  }

  interface StravaCredentials {
    stravaAccessToken: string;
    stravaAccessTokenExpiration: number;
    stravaRefreshToken: string;
  }
  async function insertUpdatedStravaCredentials(credentialsForDB: StravaCredentials, email: string, dataSrcId: string) {
    try {
      // Insert user-specific Strava credentials into our db
      const { user } = await insertStravaCredentials({ ...credentialsForDB, dataSrcId, email });
      dispatch({ type: "SET USER", payload: { user, isSignedIn: true } });
    } catch (error) {
      debugErrors(error);
    }
  }

  // DEPENDING ON WHICH RADIO IS CLICKED, EITHER HANDLE STRAVA OR MANUAL DETAILS
  useEffect(() => {
    if (activityRadioValue === "Strava") {
      fetchStravaAppCredentials();
      Linking.addEventListener("url", _handleRedirect);
      setConfirmButton({ modalAction: () => {}, buttonText: "Connect Strava" });
    } else if (activityRadioValue === "Manual") {
      Linking.removeEventListener("url", _handleRedirect);
      setConfirmButton({ modalAction: () => handleManualDetails(state.user.email), buttonText: "Done" });
    }
  }, [activityRadioValue]);

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

        // Need to add the seconds until expiration to the now moment in seconds in order to get the expiredAt value for the access token
        const nowEpoch = moment().valueOf() / 1000;
        const expiresAt = nowEpoch + expiresIn;

        const credentialsForDB = {
          stravaAccessToken: accessToken,
          stravaAccessTokenExpiration: expiresAt,
          stravaRefreshToken: refreshToken,
        };
        const { id: dataSrcId } = await getStravaUserId(credentialsForDB.stravaAccessToken);
        // After an updated Strava auth token, refresh token and expiration are fetched, save it to our DB
        insertUpdatedStravaCredentials(credentialsForDB, state.user.email, dataSrcId);
        closeModal("ChooseActivityEntry");
      })();
    }
  }, [redirectData]);

  // One-Time Strava Auth Request
  const [request, response, promptAsync] = useAuthRequest({ clientId, scopes: ["activity:read_all"], redirectUri: redirectUri || `${STRAVA_REDIRECT_URI}` }, stravaEndpoints);

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="Now that you're a pupil in my Dojo?, we'll need to hold you accountable!" disabled={!activityRadioValue} modalAction={confirmButton.modalAction} buttonText={activityRadioValue === "Manual" ? confirmButton.buttonText : null}>
      <ActionHeader type="info" text="How will you log activities?" />
      <BodyContent>
        {redirectData ? (
          <>
            <Text>{JSON.stringify(redirectData)}</Text>
          </>
        ) : (
          <>
            <ActivityEntrySelect activityRadioValue={activityRadioValue} setActivityRadioValue={setActivityRadioValue} />
            {/* <HeroInitiationChecklist crossedOut={[true, true, true]} /> */}
            {activityRadioValue === "Strava" && <StravaConnectButton request={request} promptAsync={promptAsync} />}
          </>
        )}
      </BodyContent>
    </CharacterModal>
  );
};

export default ChooseActivityEntry;
