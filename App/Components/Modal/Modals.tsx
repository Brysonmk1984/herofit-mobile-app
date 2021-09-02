import React, { useState, useContext, useEffect } from "react";
import { Button, Modal, Center, NativeBaseProvider, Text, Box, Image, View, ScrollView } from "native-base";
import CharacterModalActionButton from "./CharacterModalActionButton";
import ModalCloseButton from "./ModalCloseButton";
import { CharacterHeader } from "./CharacterHeader";
import { CharacterDialog } from "./CharacterDialog";
import { IActionHeader } from "./Content";
import useModal from "../../common/hooks/useModal";

interface ICharacterModal {
  id: string;
  modalOpen: boolean;
  modalAction?: (modalOpen: boolean) => void;
  speech: string;
  children: React.ReactChild[];
  character?: "Master Sensei Owl";
  actionHeader?: IActionHeader;
}

function getCharacterImage(character) {
  switch (character) {
    case "Master Sensei Owl":
    default:
      return require("../../../assets/images/misc/sensei-modal-header.webp");
  }
}

function CharacterModal({ children, id, modalOpen, modalAction, character = "Master Sensei Owl", speech, actionHeader }: ICharacterModal) {
  const { openModal, closeModal } = useModal();
  return (
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)} _backdrop={{ backgroundColor: "layout.modalBackdrop" }}>
      <Modal.Content p={0}>
        <CharacterHeader>
          <Image w={105} position="absolute" left={-12} top={-20} alignSelf={"flex-end"} source={getCharacterImage(character)} size={100} alt={character} />
          <CharacterDialog>
            <Text pr={5} lineHeight="16px" fontSize={15} fontFamily="handwriting">
              {speech}
            </Text>
          </CharacterDialog>
          <ModalCloseButton backgroundColor="base.background" />
        </CharacterHeader>
        <View paddingBottom={74}>{children}</View>
        <CharacterModalActionButton text={"ACCEPT"} action={() => modalAction(false)} />
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
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)} closeOnOverlayClick={closeable} isKeyboardDismissabl={closeable}>
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
  modalAction?: (modalOpen: boolean) => void;
  children: React.ReactChild | React.ReactChild[];
  title: string;
}

function BasicModal({ children, id, modalOpen, modalAction, title }: IBasicModal) {
  const { openModal, closeModal } = useModal();

  return (
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)}>
      <Modal.Content>
        <ModalCloseButton backgroundColor="primary.50" />
        <Modal.Header>
          <Text fontSize="2xl" fontFamily="heading">
            {title}
          </Text>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button w="100%" onPress={() => modalAction(false)} borderTopRightRadius={0} borderTopLeftRadius={0}>
            SAVE
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export { CharacterModal, FeedbackModal, BasicModal };
