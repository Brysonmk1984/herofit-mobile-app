import React, { useState, useContext, useEffect } from "react";
import { Modal, Text, Box } from "native-base";
import ModalCloseButton from "../ModalCloseButton";
import useModal from "../../../common/hooks/useModal";
import { ActionButton } from "../BasicModal/ActionButton";
import { emailFeedbackData, FeedbackChoiceBody } from "../../../api/email";
import { updateAlerts } from "../../../common/alerts";
import debugErrors from "../../../common/debugErrors";
import { GlobalStateContext } from "../../../store";

interface IFeedbackModal {
  modalOpen: boolean;
  id: string;
  title: string;
  modalAction: (data: object) => void;
  closeable?: boolean;
  children?: (radioValue: string, setRadioValue: (choice: string) => void, openResponse: string, setOpenResponse: (choice: string) => void) => React.ReactChild;
  preventClose?: boolean;
}

function FeedbackModal({ children, id, modalOpen, title, modalAction, closeable = false, preventClose }: IFeedbackModal) {
  const { closeModal } = useModal();
  const { state, dispatch } = useContext(GlobalStateContext);
  const [radioValue, setRadioValue] = useState(null);
  const [openResponse, setOpenResponse] = useState("");
  const { user } = state;

  function handleFormAction(id: string, modalAction: () => void) {
    const accountInfo = { username: user.username, firstName: user.firstName, email: user.email };
    setOpenResponse(null);
    setRadioValue(null);
    // attempt to submit the form
    _handleSubmit(
      {
        email: user.email,
        username: user.username,
        title,
        opinion: radioValue,
        openResponse,
        accountInfo,
      },
      modalAction,
    );
  }

  // Handle submit of form: send form data to back end, which handles sending the email logic
  async function _handleSubmit(body: FeedbackChoiceBody, modalAction: () => void) {
    try {
      const data = await emailFeedbackData(body);
      updateAlerts([{ type: "success", message: "Feedback Submitted!" }], state, dispatch);
      modalAction(data);
      if (!preventClose) {
        closeModal(id);
      }
    } catch (error) {
      const errorMessage = debugErrors(error, state.user);
      updateAlerts([{ type: "error", message: errorMessage }], state, dispatch);
      closeModal(id);
    }
  }

  return (
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)} /*closeOnOverlayClick={closeable}*/ isKeyboardDismissable={closeable}>
      <Modal.Content p={2}>
        {closeable && <ModalCloseButton backgroundColor="primary.50" />}
        <Modal.Header pl={4} py={4}>
          <Text fontSize="2xl" fontFamily="heading">
            {title}
          </Text>
        </Modal.Header>
        <Modal.Body p={0} justifyContent="center">
          {children(radioValue, setRadioValue, openResponse, setOpenResponse)}
        </Modal.Body>
        <Box p={2} pb={4}>
          <ActionButton disabled={!radioValue} action={() => handleFormAction(id, modalAction)}>
            Send Feedback
          </ActionButton>
        </Box>
      </Modal.Content>
    </Modal>
  );
}

export default FeedbackModal;
