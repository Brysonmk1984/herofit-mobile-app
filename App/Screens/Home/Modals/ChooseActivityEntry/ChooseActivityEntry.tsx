import React, { useContext, useEffect, useState } from "react";
import { ActivityEntrySelect } from "./ActivityEntrySelect";
import StravaConnectButton from "../../../../Components/Buttons/StravaConnectButton";
import { CharacterModal } from "../../../../Components/ModalTemplates/ModalTemplates";
import { BodyContent } from "../../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../../store";
import { createManualDataSrcId } from "../../../../api/authentication";
import debugErrors from "../../../../common/debugErrors";
import useModal from "../../../../common/hooks/useModal";
import useStravaConnect from "../../../../common/hooks/useStravaConnect";
import HelperText from "../../../../Components/HelperText";
import LoadingInPane from "../../../../Components/LoadingInPane";
import { ModalActionHeader } from "../../../../Components/ModalTemplates/ModalActionHeader";

interface ChooseActivityEntryProps {
  id: string;
  getFreshStravaData: (manually: true) => void;
  fetchAndUpdateInventory: () => void;
  addToast: (type: ActionFeedbackType, message: string, duration?: number, offset?: number | "default", link?: string, persist?: boolean) => {};
}

// SELECT ACTIVITY ENTRY MODE
const ChooseActivityEntry: React.FC<ChooseActivityEntryProps> = ({ id, getFreshStravaData, fetchAndUpdateInventory, addToast }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const { clientId, request, promptAsync, stravaSuccess, setStravaSuccess, helperText } = useStravaConnect();
  const [activityRadioValue, setActivityRadioValue] = useState(null);
  const [confirmButton, setConfirmButton] = useState({ modalAction: () => {}, buttonText: "Done" });
  const [loading, setLoading] = useState(false);

  function _handleSignupAwardMessage(message) {
    // If there's an award on signup, add Toast message here
    if (message) {
      setTimeout(() => {
        addToast("success", message, 4000, 250);
      }, 1000);
    }
  }

  async function handleManualDetails(email: string) {
    try {
      const { user } = await createManualDataSrcId({ email });
      dispatch({ type: "SET USER", payload: { user, isSignedIn: true } });
      fetchAndUpdateInventory();
      closeModal("ChooseActivityEntry");
      openModal("SignupFinished");

      // If there's an award on signup, add Toast message here
      if (state.awardedItemMessage) {
        setTimeout(() => {
          addToast("success", state.awardedItemMessage, 4000, 250);
        }, 1000);
      }
      // Signup award message
      _handleSignupAwardMessage(state.awardedItemMessage);
    } catch (error) {
      debugErrors(error, state.user);
    }
  }

  // DEPENDING ON WHICH RADIO IS CLICKED, EITHER HANDLE STRAVA OR MANUAL DETAILS
  useEffect(() => {
    if (activityRadioValue) {
      if (activityRadioValue === "Strava") {
        setConfirmButton({ modalAction: () => {}, buttonText: "Connect Strava" });
      } else if (activityRadioValue === "Manual") {
        setConfirmButton({ modalAction: () => handleManualDetails(state.user.email), buttonText: "Done" });
      }
    }
  }, [activityRadioValue]);

  // If Strava Connection was Successfully completed, close modal
  useEffect(() => {
    if (stravaSuccess) {
      closeModal("ChooseActivityEntry");
      setStravaSuccess(false);

      // TODO: should only call this if new user...
      setTimeout(() => {
        // Signup award message
        _handleSignupAwardMessage(state.awardedItemMessage);

        openModal("SignupFinished");
        getFreshStravaData(true);
      }, 1500);
    }
  }, [stravaSuccess]);

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="Now that you're a pupil in my dojo, I'll have my eye on you... with my 360 degree vision!" disabled={!activityRadioValue} modalAction={confirmButton.modalAction} buttonText={activityRadioValue === "Manual" ? confirmButton.buttonText : null}>
      <ModalActionHeader type="info" text="How will you log activities??" />
      <BodyContent>
        {stravaSuccess ? (
          <HelperText type="success" text="HeroFit is now connected to your Strava account!" />
        ) : (
          <>
            <ActivityEntrySelect activityRadioValue={activityRadioValue} setActivityRadioValue={setActivityRadioValue} />
            {/* <HeroInitiationChecklist crossedOut={[true, true, true]} /> */}
            {loading && <LoadingInPane text="Fetching Client Credentials" />}
            {helperText && activityRadioValue === "Strava" && <HelperText type="caution" fontSize="sm" text={helperText} />}
            {activityRadioValue === "Strava" && <StravaConnectButton disable={!request || !clientId} promptAsync={promptAsync} />}
          </>
        )}
      </BodyContent>
    </CharacterModal>
  );
};

export default ChooseActivityEntry;
