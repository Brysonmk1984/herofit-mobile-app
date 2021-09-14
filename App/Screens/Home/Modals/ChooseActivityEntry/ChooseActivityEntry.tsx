import React, { useContext, useEffect, useState } from "react";
import { Text } from "native-base";
import { ActivityEntrySelect } from "./ActivityEntrySelect";
import StravaConnect from "./StravaConnect";
import { CharacterModal } from "../../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../../store";
import { createManualDataSrcId } from "../../../../api/authentication";
import debugErrors from "../../../../common/debugErrors";
import useModal from "../../../../common/hooks/useModal";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

interface ChooseActivityEntryProps {
  id: string;
}

// SELECT ACTIVITY ENTRY MODE
const ChooseActivityEntry: React.FC<ChooseActivityEntryProps> = ({ id }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const [activityRadioValue, setActivityRadioValue] = useState(null);
  const [confirmButton, setConfirmButton] = useState({ modalAction: () => {}, buttonText: "Done" });
  const [redirectData, setRedirectData] = useState(null);

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

  useEffect(() => {
    if (activityRadioValue === "Strava") {
      Linking.addEventListener("url", _handleRedirect);
      setConfirmButton({ modalAction: () => {}, buttonText: "Connect Strava" });
    } else if (activityRadioValue === "Manual") {
      Linking.removeEventListener("url", _handleRedirect);
      setConfirmButton({ modalAction: () => handleManualDetails(state.user.email), buttonText: "Done" });
    }
  }, [activityRadioValue]);

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="Now that you're a pupil in my Dojo?, we'll need to hold you accountable!" disabled={!activityRadioValue} modalAction={confirmButton.modalAction} buttonText={activityRadioValue === "Manual" ? confirmButton.buttonText : null}>
      <ActionHeader type="info" text="How will you log activities?" />
      <BodyContent>
        {redirectData ? (
          <Text>{JSON.stringify(redirectData)}</Text>
        ) : (
          <>
            <ActivityEntrySelect activityRadioValue={activityRadioValue} setActivityRadioValue={setActivityRadioValue} />
            {/* <HeroInitiationChecklist crossedOut={[true, true, true]} /> */}
            {activityRadioValue === "Strava" && <StravaConnect email={state.user.email} />}
          </>
        )}
      </BodyContent>
    </CharacterModal>
  );
};

export default ChooseActivityEntry;
