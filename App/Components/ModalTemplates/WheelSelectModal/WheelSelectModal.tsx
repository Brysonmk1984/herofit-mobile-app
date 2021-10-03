import React, { useContext, useState } from "react";
import { Modal, Box, Text, HStack } from "native-base";
import { ActionButton } from "../BasicModal/ActionButton";
import ModalCloseButton from "../ModalCloseButton";
import useModal from "../../../common/hooks/useModal";
import { GlobalStateContext } from "../../../store";

interface WheelSelectModalProps {
  modalOpen: boolean;
  id: string;
  title: string;
  modalAction: () => void;
  closeable?: boolean;
  children?: React.ReactChild | React.ReactChild[];
  preventClose?: boolean;
  disabled?: boolean;
}

const WheelSelectModal: React.FC<WheelSelectModalProps> = ({ children, id, modalOpen, title, modalAction, closeable = false, preventClose, disabled }) => {
  const { closeModal } = useModal();

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
          <HStack>{children}</HStack>
        </Modal.Body>
        <Box p={2} pb={4}>
          <ActionButton disabled={disabled} action={modalAction}>
            OK
          </ActionButton>
        </Box>
      </Modal.Content>
    </Modal>
  );
};

export default WheelSelectModal;
