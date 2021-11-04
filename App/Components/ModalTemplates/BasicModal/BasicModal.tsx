import React from "react";
import { Modal, Text, Box, View } from "native-base";
import ModalCloseButton from "../ModalCloseButton";
import useModal from "../../../common/hooks/useModal";
import { ActionButton } from "./ActionButton";

interface IBasicModal {
  id: string;
  modalOpen: boolean;
  title: string;
  children: React.ReactChild | React.ReactChild[];
  modalAction?: () => void;
  buttonText?: string;
  disabled?: boolean;
  preventClose?: boolean;
}

function BasicModal({ children, id, modalOpen, modalAction, title, buttonText = "OK", disabled = false, preventClose }: IBasicModal) {
  const { closeModal } = useModal();

  function handleModalAction(idToClose: string, modalAction: () => void, preventClose: boolean) {
    if (modalAction) {
      modalAction();
    }
    if (!preventClose) {
      closeModal(idToClose);
    }
  }

  return (
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)} closeOnOverlayClick={!preventClose}>
      <Modal.Content overflow="visible" p={0}>
        <ModalCloseButton bgColor="primary.50" />
        <Modal.Header px={5} py={6}>
          <View>
            <Text fontSize="2xl" fontFamily="heading" overflow="hidden">
              {title}
            </Text>
          </View>
        </Modal.Header>
        <Box overflow="hidden">{children}</Box>
        <Box p={2} pb={4}>
          <ActionButton disabled={disabled} action={() => handleModalAction(id, modalAction, preventClose)}>
            {buttonText}
          </ActionButton>
        </Box>
      </Modal.Content>
    </Modal>
  );
}

export default BasicModal;
