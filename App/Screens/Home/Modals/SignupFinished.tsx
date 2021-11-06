import React, { useContext } from "react";
import { Heading, Text, Box } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";
import HeroInitiationChecklist from "./Components/HeroInitiationChecklist";
import { ModalActionHeader } from "../../../Components/ModalTemplates/ModalActionHeader";

interface SignupFinishedProps {
  id: string;
}

// SIGNUP PROCESS ALL FINISHED
const SignupFinished: React.FC<SignupFinishedProps> = ({ id }) => {
  const { state } = useContext(GlobalStateContext);
  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="Promise you show great amounts of, my fledgling. Now Go do your exercises!" buttonText="OK, GREAT!">
      <ModalActionHeader type="success" text="All Done!" />
      <BodyContent>
        <HeroInitiationChecklist crossedOut={[true, true, true, true]} />
      </BodyContent>
    </CharacterModal>
  );
};

export default SignupFinished;
