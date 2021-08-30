import React, { useState } from "react";
import { Button, Modal, Center, NativeBaseProvider, Text, Box, Image, View, ScrollView } from "native-base";
import CharacterModalActionButton from "./CharacterModalActionButton";
import ModalCloseButton from "./ModalCloseButton";
import { CharacterHeader } from "./CharacterHeader";
import { CharacterDialog } from "./CharacterDialog";
import { IActionHeader } from "./Content";
import Icon from "../Icon";

interface ICharacterModal {
  modalOpen: boolean;
  modalAction: (modalOpen: boolean) => void;
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

function CharacterModal({ children, modalOpen, modalAction, character = "Master Sensei Owl", speech, actionHeader }: ICharacterModal) {
  return (
    <Modal isOpen={modalOpen} onClose={() => modalAction(false)} _backdrop={{ backgroundColor: "layout.modalBackdrop" }}>
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
  modalAction: (modalOpen: boolean) => void;
  children?: React.ReactChild | React.ReactChild[];
}

function renderFormBody(children: React.ReactChild | React.ReactChild[] | null) {
  if (!children) {
    // basic contact form
  } else {
    return { children };
  }
}

function FeedbackModal({ children, modalOpen, modalAction }: IFeedbackModal) {
  return (
    <Modal isOpen={modalOpen} onClose={() => modalAction(false)}>
      <Modal.Content>
        <ModalCloseButton backgroundColor="primary.50" />
        <Modal.Header>Modal Title</Modal.Header>
        <Modal.Body>{renderFormBody(children)}</Modal.Body>
        <Modal.Footer>
          <Button w="100%" onPress={() => modalAction(false)} borderTopRightRadius={0} borderTopLeftRadius={0}>
            SAVE
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

interface IBasicModal {
  modalOpen: boolean;
  modalAction: (modalOpen: boolean) => void;
  children: React.ReactChild | React.ReactChild[];
  title: string;
}

function BasicModal({ children, modalOpen, modalAction, title }: IBasicModal) {
  return (
    <Modal isOpen={modalOpen} onClose={() => modalAction(false)}>
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
