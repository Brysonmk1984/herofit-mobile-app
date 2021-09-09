import React, { useContext, useEffect, useState } from "react";
import { ActivityEntrySelect } from "./ActivityEntrySelect";
import StravaConnect from "../../AuthFinalSteps/StravaConnect";
import { CharacterModal } from "../../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../../Components/ModalTemplates/BasicModal/Content";
import { Button } from "react-native";
import { GlobalStateContext } from "../../../../store";
import { createManualDataSrcId } from "../../../../api/authentication";
import debugErrors from "../../../../common/debugErrors";
import useModal from "../../../../common/hooks/useModal";

interface ChooseActivityEntryProps {
  id: string;
}

// SELECT ACTIVITY ENTRY MODE
const ChooseActivityEntry: React.FC<ChooseActivityEntryProps> = ({ id }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
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

  useEffect(() => {
    if (activityRadioValue === "Strava") {
      setConfirmButton({ modalAction: () => {}, buttonText: "Connect Strava" });
    } else if (activityRadioValue === "Manual") {
      setConfirmButton({ modalAction: () => handleManualDetails(state.user.email), buttonText: "Done" });
    }
  }, []);

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="Now that you're a pupil in my Dojo?, we'll need to hold you accountable!" disabled={!activityRadioValue} modalAction={confirmButton.modalAction} buttonText={confirmButton.buttonText}>
      <ActionHeader type="info" text="How will you log activities?" />
      <BodyContent>
        <ActivityEntrySelect activityRadioValue={activityRadioValue} setActivityRadioValue={setActivityRadioValue} />
        {/* <View p={3} backgroundColor="base.background">
          <Heading borderBottomWidth={2} borderColor="primary.900" textAlign="center">
            <Text fontSize="2xl" fontFamily="heading">
              The Hero's Initiation
            </Text>
          </Heading>
          <Box pl={10}>
            <Text strikeThrough={true} opacity={0.5}>
              1. Choose your Hero
            </Text>
            <Text strikeThrough={true} opacity={0.5}>
              2. Create a HeroFit Account
            </Text>
            <Text strikeThrough={true} opacity={0.5}>
              3. Confirm Email
            </Text>
            <Text>4. Choose Strava or Manual Mode</Text>
          </Box>
        </View> */}
      </BodyContent>
    </CharacterModal>
  );
};

export default ChooseActivityEntry;
