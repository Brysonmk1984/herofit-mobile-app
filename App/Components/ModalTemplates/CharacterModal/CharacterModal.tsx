import React from "react";
import { StyleSheet } from "react-native";
import { Modal, Text, Image, View } from "native-base";
import CharacterModalActionButton from "./CharacterModalActionButton";
import ModalCloseButton from "../ModalCloseButton";
import { CharacterHeader } from "./CharacterHeader";
import { CharacterDialog } from "./CharacterDialog";
import { IActionHeader } from "../BasicModal/Content";
import useModal from "../../../common/hooks/useModal";
import Triangle from "../../../Screens/Home/Components/BottomDrawer/Triangle";

interface ICharacterModal {
  id: string;
  modalOpen: boolean;
  modalAction?: () => void;
  speech: string;
  children: React.ReactChild[];
  character?: "Master Sensei Owl";
  actionHeader?: IActionHeader;
  buttonText?: string;
  disabled?: boolean;
  preventClose?: boolean;
}

function getCharacterImage(character) {
  switch (character) {
    case "Master Sensei Owl":
    default:
      return require("../../../../assets/images/misc/sensei-modal-header.webp");
  }
}

function CharacterModal({ children, id, modalOpen, modalAction, character = "Master Sensei Owl", speech, buttonText, disabled, preventClose }: ICharacterModal) {
  const { closeModal } = useModal();

  function handleModalAction(idToClose: string, modalAction: () => void) {
    if (modalAction) {
      modalAction();
    }
    if (!preventClose) {
      closeModal(idToClose);
    }
  }
  return (
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)} _backdrop={{ backgroundColor: "layout.modalBackdrop" }}>
      <Modal.Content p={0}>
        <CharacterHeader>
          <Image zIndex="10" elevation={10} w={105} position="absolute" left={-12} top={-20} alignSelf={"flex-end"} source={getCharacterImage(character)} size={100} alt={character} />
          <CharacterDialog>
            <View style={styles.triangle}></View>
            <Text textAlign="justify" color="primary.700" flexWrap="wrap" lineHeight="18px" fontSize={15}>
              {speech}
            </Text>
          </CharacterDialog>
          <ModalCloseButton backgroundColor="base.background" />
        </CharacterHeader>
        <View paddingBottom={74}>{children}</View>
        {buttonText && <CharacterModalActionButton disabled={disabled} buttonText={buttonText} action={() => handleModalAction(id, modalAction)} />}
      </Modal.Content>
    </Modal>
  );
}

export default CharacterModal;

const styles = StyleSheet.create({
  triangle: {
    position: "absolute",
    left: -20,
    top: 25,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 20,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "#fff",
  },
});
