import React, { useContext, useEffect, useState } from "react";
import { ActivityEntrySelect } from "./ActivityEntrySelect";
import StravaConnectButton from "../../../../Components/Buttons/StravaConnectButton";
import { CharacterModal } from "../../../../Components/ModalTemplates/ModalTemplates";
import { BodyContent } from "../../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../../store";
import { createManualDataSrcId } from "../../../../api/authentication";
import debugErrors from "../../../../common/debugErrors";
import useModal from "../../../../common/hooks/useModal";
import * as Linking from "expo-linking";
import useStravaConnect from "../../../../common/hooks/useStravaConnect";
import HelperText from "../../../../Components/HelperText";
import LoadingInPane from "../../../../Components/LoadingInPane";
import { Box } from "native-base";
import { BackHandler } from "react-native";
import { ModalActionHeader } from "../../../../Components/ModalTemplates/ModalActionHeader";

interface ChooseActivityEntryProps {
  id: string;
}

// SELECT ACTIVITY ENTRY MODE
const ChooseActivityEntry: React.FC<ChooseActivityEntryProps> = ({ id }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const { clientId, request, promptAsync, stravaSuccess, helperText } = useStravaConnect();
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
      setTimeout(() => {
        openModal("SignupFinished");
      }, 1500);
    }
  }, [stravaSuccess]);

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="Now that you're a pupil in my Dojo?, we'll need to hold you accountable!" disabled={!activityRadioValue} modalAction={confirmButton.modalAction} buttonText={activityRadioValue === "Manual" ? confirmButton.buttonText : null}>
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
