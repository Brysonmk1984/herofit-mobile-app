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
import useStravaConnect from "./Strava/StravaConnect";
import HelperText from "../../../../Components/HelperText";

interface ChooseActivityEntryProps {
  id: string;
}

// SELECT ACTIVITY ENTRY MODE
const ChooseActivityEntry: React.FC<ChooseActivityEntryProps> = ({ id }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const { getStravaCredentials, handleStravaRedirect, request, promptAsync, stravaSuccess } = useStravaConnect();
  const [activityRadioValue, setActivityRadioValue] = useState(null);
  const [confirmButton, setConfirmButton] = useState({ modalAction: () => {}, buttonText: "Done" });

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

  function _handleStravaDetails() {
    getStravaCredentials();
    setConfirmButton({ modalAction: () => {}, buttonText: "Connect Strava" });
    Linking.addEventListener("url", handleStravaRedirect);
    //return Linking.addEventListener("url", handleStravaRedirect);
  }

  // DEPENDING ON WHICH RADIO IS CLICKED, EITHER HANDLE STRAVA OR MANUAL DETAILS
  useEffect(() => {
    if (activityRadioValue) {
      //let stravaLinkEventListener;
      if (activityRadioValue === "Strava") {
        // Sets the state for all the strava details, then sets the event listener
        //stravaLinkEventListener =

        _handleStravaDetails();
      } else if (activityRadioValue === "Manual") {
        Linking.removeEventListener("url", handleStravaRedirect);
        setConfirmButton({ modalAction: () => handleManualDetails(state.user.email), buttonText: "Done" });
      }
    }
  }, [activityRadioValue]);

  // If Strava Connection was Successfully completed, close modal
  useEffect(() => {
    if (stravaSuccess) {
      closeModal("ChooseActivityEntry");
      openModal("SignupFinished");
    }
  }, [stravaSuccess]);

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="Now that you're a pupil in my Dojo?, we'll need to hold you accountable!" disabled={!activityRadioValue} modalAction={confirmButton.modalAction} buttonText={activityRadioValue === "Manual" ? confirmButton.buttonText : null}>
      <ActionHeader type="info" text="How will you log activities?" />
      <BodyContent>
        {stravaSuccess ? (
          <HelperText type="success" text="HeroFit is now connected to your Strava account!" />
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
