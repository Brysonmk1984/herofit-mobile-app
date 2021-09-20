import React, { useContext } from "react";
import FeedbackChoiceForm from "./FeedbackChoiceForm";
import { FeedbackModal } from "../../../../Components/ModalTemplates/ModalTemplates";
import { GlobalStateContext } from "../../../../store";

interface FeedbackChoiceProps {
  id: string;
  modalAction?: (formData: object) => void;
}

// FEEDBACK MODAL - MULTIPLE CHOICE + TEXTAREA
const FeedbackChoice: React.FC<FeedbackChoiceProps> = ({ id, modalAction }) => {
  const { state } = useContext(GlobalStateContext);
  return (
    <FeedbackModal id={id} modalOpen={state.modalQueue[0] === id} title="Quick Question" modalAction={modalAction}>
      {(radioValue, setRadioValue, openResponse, setOpenResponse) => <FeedbackChoiceForm id={id} title={"How would you feel if you could never play HeroFit again?"} radioValue={radioValue} setRadioValue={setRadioValue} openResponse={openResponse} setOpenResponse={setOpenResponse} />}
    </FeedbackModal>
  );
};

export default FeedbackChoice;
