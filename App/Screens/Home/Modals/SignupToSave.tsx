import React, { useContext } from "react";
import { Heading, Box, View, Text } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";
import HeroInitiationChecklist from "./Components/HeroInitiationChecklist";
import { ModalActionHeader } from "../../../Components/ModalTemplates/ModalActionHeader";

interface SignupToSaveProps {
  id: string;
  modalAction: () => void;
}

// SIGNUP TO SAVE CHARACTER POPUP
const SignupToSave: React.FC<SignupToSaveProps> = ({ id, modalAction }) => {
  const { state } = useContext(GlobalStateContext);
  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="What's this? a new student? hmmm... I'll consider it. Tell me about yourself, drifter." modalAction={modalAction} buttonText="OK">
      <ModalActionHeader type="caution" text="Sign Up to Save your Hero" />
      <BodyContent>
        <HeroInitiationChecklist crossedOut={[true]} />
      </BodyContent>
    </CharacterModal>
  );
};

export default SignupToSave;
