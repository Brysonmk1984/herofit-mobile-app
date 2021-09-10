import React, { useContext, useEffect, useState } from "react";
import { Heading, Box, View, Text, ScrollView } from "native-base";
import { BasicModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";
import HeroInitiationChecklist from "./Components/HeroInitiationChecklist";

interface ConfirmEmailProps {
  id: string;
  modalAction: () => void;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({ id, modalAction }) => {
  const { state } = useContext(GlobalStateContext);
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    // Timeout is only to prevent the user from clicking the action button right away without checking email
    setTimeout(() => {
      setDisableButton(false);
    }, 8000);
  }, []);

  return (
    <BasicModal id={id} modalOpen={state.modalQueue[0] === id} modalAction={() => modalAction()} disabled={disableButton} title="Please Confirm Your Email!" buttonText="Ok, I did it!" preventClose={state.userStatus === "unconfirmed" ? true : false}>
      <ActionHeader type="warning" text="Confirm Email & Receive +5 QP" />
      <BodyContent>
        <ScrollView>
          <HeroInitiationChecklist crossedOut={[true, true]} />
        </ScrollView>
      </BodyContent>
    </BasicModal>
  );
};

export default ConfirmEmail;
