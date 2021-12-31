import React from "react";
import { Modal, Text, Box, View } from "native-base";
import ModalCloseButton from "../ModalCloseButton";
import useModal from "../../../common/hooks/useModal";
import ModalActionButton from "../ModalActionButton";

interface IBasicModal {
  id: string;
  modalOpen: boolean;
  title: string;
  children: React.ReactChild | React.ReactChild[];
  modalAction?: () => void;
  buttonText?: string;
  disabled?: boolean;
  preventClose?: boolean;
  closeModalAction?: (val: any) => void | undefined;
  hideCloseButton?: boolean;
}

function BasicModal({ children, id, modalOpen, modalAction, title, buttonText = "OK", disabled = false, preventClose, hideCloseButton = false, closeModalAction }: IBasicModal) {
  const { closeModal } = useModal();

  function handleModalAction(idToClose: string, modalAction: () => void, preventClose: boolean) {
    if (modalAction) {
      modalAction();
    }
    if (!preventClose) {
      closeModal(idToClose);
    }
  }

  function _onClose(closeModalAction) {
    if (closeModalAction) {
      closeModalAction();
    } else {
      closeModal(id);
    }
  }

  return (
    <Modal isOpen={modalOpen} onClose={() => _onClose(closeModalAction)} closeOnOverlayClick={!preventClose} isKeyboardDismissable={!preventClose}>
      <Modal.Content>
        {!preventClose && !hideCloseButton && <ModalCloseButton bgColor="primary.50" />}
        <Modal.Header px={5} py={3}>
          <View>
            <Text textAlign="center" fontSize="2xl" fontFamily="heading" overflow="hidden">
              {title}
            </Text>
          </View>
        </Modal.Header>
        <Box overflow="hidden">{children}</Box>
        <ModalActionButton disabled={disabled} action={() => handleModalAction(id, modalAction, preventClose)}>
          {buttonText}
        </ModalActionButton>
      </Modal.Content>
    </Modal>
  );
}

export default BasicModal;
