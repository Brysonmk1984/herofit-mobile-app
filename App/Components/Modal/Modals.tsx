import React, { useState, useContext, useEffect } from "react";
import { Button, Modal, Center, NativeBaseProvider, Text, Box, Image, View, ScrollView } from "native-base";
import CharacterModalActionButton from "./CharacterModalActionButton";
import ModalCloseButton from "./ModalCloseButton";
import { CharacterHeader } from "./CharacterHeader";
import { CharacterDialog } from "./CharacterDialog";
import { IActionHeader } from "./Content";
import useModal from "../../common/hooks/useModal";
import { ActionButton } from "./ActionButton";

interface ICharacterModal {
  id: string;
  modalOpen: boolean;
  modalAction?: () => void;
  speech: string;
  children: React.ReactChild[];
  character?: "Master Sensei Owl";
  actionHeader?: IActionHeader;
  buttonText?: string;
}

function getCharacterImage(character) {
  switch (character) {
    case "Master Sensei Owl":
    default:
      return require("../../../assets/images/misc/sensei-modal-header.webp");
  }
}

function CharacterModal({ children, id, modalOpen, modalAction, character = "Master Sensei Owl", speech, buttonText }: ICharacterModal) {
  const { openModal, closeModal } = useModal();

  function handleModalAction(idToClose: string, modalAction: () => void) {
    console.log("HERE!");
    if (modalAction) {
      modalAction();
    }
    closeModal(idToClose);
  }
  return (
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)} _backdrop={{ backgroundColor: "layout.modalBackdrop" }}>
      <Modal.Content p={0}>
        <CharacterHeader>
          <Image w={105} position="absolute" left={-12} top={-20} alignSelf={"flex-end"} source={getCharacterImage(character)} size={100} alt={character} />
          <CharacterDialog>
            <Text pr={3} lineHeight="20px" fontSize={15} fontFamily="handwriting">
              {speech}
            </Text>
          </CharacterDialog>
          <ModalCloseButton backgroundColor="base.background" />
        </CharacterHeader>
        <View paddingBottom={74}>{children}</View>
        {buttonText && <CharacterModalActionButton buttonText={buttonText} action={() => handleModalAction(id, modalAction)} />}
      </Modal.Content>
    </Modal>
  );
}

interface IFeedbackModal {
  modalOpen: boolean;
  //modalAction: () => void;
  id: string;
  title: string;
  closeable?: boolean;
  children?: React.ReactChild | React.ReactChild[];
}

function FeedbackModal({ children, id, modalOpen, title, closeable = false }: IFeedbackModal) {
  const { openModal, closeModal } = useModal();

  return (
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)} closeOnOverlayClick={closeable} isKeyboardDismissable={closeable}>
      <Modal.Content p={2}>
        {closeable && <ModalCloseButton backgroundColor="primary.50" />}
        <Modal.Header pl={4} py={4}>
          <Text fontSize="2xl" fontFamily="heading">
            {title}
          </Text>
        </Modal.Header>
        <Modal.Body p={0} justifyContent="center">
          {children}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

interface IBasicModal {
  id: string;
  modalOpen: boolean;
  title: string;
  children: React.ReactChild | React.ReactChild[];
  modalAction?: () => void;
  buttonText?: string;
  disabled?: boolean;
}

function BasicModal({ children, id, modalOpen, modalAction, title, buttonText = "OK", disabled = false }: IBasicModal) {
  const { openModal, closeModal } = useModal();

  function handleModalAction(idToClose: string, modalAction: () => void) {
    if (modalAction) {
      modalAction();
    }
    closeModal(idToClose);
  }

  return (
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)}>
      <Modal.Content p={0}>
        <ModalCloseButton backgroundColor="primary.50" />
        <Modal.Header px={5} py={6}>
          <View>
            <Text fontSize="2xl" fontFamily="heading" overflow="hidden">
              {title}
            </Text>
          </View>
        </Modal.Header>
        <Box overflow="hidden">{children}</Box>
        <Box p={2} pb={4}>
          <ActionButton disabled={disabled} action={() => handleModalAction(id, modalAction)}>
            {buttonText}
          </ActionButton>
        </Box>
      </Modal.Content>
    </Modal>
  );
}

export { CharacterModal, FeedbackModal, BasicModal };
