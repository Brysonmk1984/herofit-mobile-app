import React from "react";
import { Modal, Text, Image, View } from "native-base";
import CharacterModalActionButton from "./CharacterModalActionButton";
import ModalCloseButton from "../ModalCloseButton";
import ItemHeader from "./ItemHeader";
import ItemDescription from "./ItemDescription";
import { IActionHeader } from "../BasicModal/Content";
import useModal from "../../../common/hooks/useModal";
import { CharacterName, Item } from "../../../common/types";
import ItemModalActionButton from "./ItemModalActionButton";
import ItemImage from "../../../common/ItemImage";

interface ItemModalProps {
  children: React.ReactChild[];
  id: string;
  modalOpen: boolean;
  modalAction?: () => void;
  item: Item;
  character?: CharacterName;
  actionHeader?: IActionHeader;
  buttonText?: string;
  disabled?: boolean;
  preventClose?: boolean;
}

const ItemModal = function ({ children, id, modalOpen, modalAction, item, character, buttonText, disabled, preventClose }: ItemModalProps) {
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
        <ItemHeader>
          <ItemImage item={item} w={105} character={character} />
          {/* <Image zIndex="10" elevation={10} w={105} position="absolute" left={-12} top={-20} alignSelf={"flex-end"} source={_getItemImage(item, item.type)} size={100} /> */}
          <ItemDescription>
            <Text textAlign="justify" color="primary.700" flexWrap="wrap" lineHeight="18px" fontSize={15}>
              {item.description}
            </Text>
          </ItemDescription>
          <ModalCloseButton backgroundColor="base.background" />
        </ItemHeader>
        <View paddingBottom={74}>{children}</View>
        {buttonText && <ItemModalActionButton disabled={disabled} buttonText={buttonText} action={() => handleModalAction(id, modalAction)} />}
      </Modal.Content>
    </Modal>
  );
};

export default ItemModal;
