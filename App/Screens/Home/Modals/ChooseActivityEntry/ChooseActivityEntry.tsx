import React, { useContext, useEffect, useState } from "react";
import { ActivityEntrySelect } from "./ActivityEntrySelect";
import StravaConnectButton from "./Strava/StravaConnectButton";
import { CharacterModal } from "../../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../../store";
import { createManualDataSrcId } from "../../../../api/authentication";
import debugErrors from "../../../../common/debugErrors";
import useModal from "../../../../common/hooks/useModal";
import * as Linking from "expo-linking";
import useStravaConnect from "./Strava/useStravaConnect";
import HelperText from "../../../../Components/HelperText";
import LoadingInPane from "../../../../Components/LoadingInPane";
import { Box } from "native-base";
import { BackHandler } from "react-native";

interface ChooseActivityEntryProps {
  id: string;
}

// SELECT ACTIVITY ENTRY MODE
const ChooseActivityEntry: React.FC<ChooseActivityEntryProps> = ({ id }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const { getStravaCredentials, handleStravaRedirect, request, promptAsync, stravaSuccess, helperText, setHasFetchedStravaDetails } = useStravaConnect();
  const [activityRadioValue, setActivityRadioValue] = useState(null);
  const [confirmButton, setConfirmButton] = useState({ modalAction: () => {}, buttonText: "Done" });
  const [loading, setLoading] = useState(false);

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

  async function _handleStravaDetails() {
    console.log(3);
    setLoading(true);
    // The Strava Client credentials are stores in the hook's state, and applied to the "Connect Strava" button
    await getStravaCredentials();
    setConfirmButton({ modalAction: () => {}, buttonText: "Connect Strava" });
    setLoading(false);
    console.log("ADDING EVENT LISTENER", Linking.addEventListener);
    //Linking.addEventListener("url", data => handleStravaRedirect(data));
    //Linking.getInitialURL().then(url => handleStravaRedirect(url));
    //BackHandler.exitApp();
    //Linking.openURL("https://www.strava.com/oauth/mobile/authorize");
  }

  // DEPENDING ON WHICH RADIO IS CLICKED, EITHER HANDLE STRAVA OR MANUAL DETAILS
  useEffect(() => {
    if (activityRadioValue) {
      //let stravaLinkEventListener;
      if (activityRadioValue === "Strava") {
        // Sets the state for all the strava details, then sets the event listener
        _handleStravaDetails();
      } else if (activityRadioValue === "Manual") {
        //Linking.removeEventListener("url", handleStravaRedirect);
        setConfirmButton({ modalAction: () => handleManualDetails(state.user.email), buttonText: "Done" });
      }
    }
  }, [activityRadioValue]);

  // If Strava Connection was Successfully completed, close modal
  useEffect(() => {
    if (stravaSuccess) {
      closeModal("ChooseActivityEntry");
      setTimeout(() => {
        openModal("SignupFinished");
      }, 1500);
    }
  }, [stravaSuccess]);

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="Now that you're a pupil in my Dojo?, we'll need to hold you accountable!" disabled={!activityRadioValue} modalAction={confirmButton.modalAction} buttonText={activityRadioValue === "Manual" ? confirmButton.buttonText : null}>
      <ActionHeader type="info" text="How will you log activities??" />
      <BodyContent>
        {stravaSuccess ? (
          <HelperText type="success" text="HeroFit is now connected to your Strava account!" />
        ) : (
          <>
            <ActivityEntrySelect activityRadioValue={activityRadioValue} setActivityRadioValue={setActivityRadioValue} />
            {/* <HeroInitiationChecklist crossedOut={[true, true, true]} /> */}
            {activityRadioValue === "Strava" && <StravaConnectButton request={request} promptAsync={promptAsync} setHasFetchedStravaDetails={setHasFetchedStravaDetails} />}
          </>
        )}
        {loading && <LoadingInPane text="Fetching Client Credentials" />}
        {helperText && <HelperText type="error" fontSize="sm" text={helperText} />}
      </BodyContent>
    </CharacterModal>
  );
};

export default ChooseActivityEntry;
