import React from "react";
import { Modal, Text, View, Box } from "native-base";
import ModalCloseButton from "../ModalCloseButton";
import ItemHeader from "./ItemHeader";
import ItemDescription from "./ItemDescription";
import { IActionHeader } from "../ModalActionHeader";
import useModal from "../../../common/hooks/useModal";
import { CharacterName, Item, ItemWithOwnership } from "../../../common/types";
import ItemModalActionButton from "./ItemModalActionButton";
import ItemImage from "../../ItemImage";
import ModalHeaderImage from "../ModalHeaderImage";
import ItemTitle from "./ItemTitle";
import ItemLore from "./ItemLore";
import { ModalContent } from "../ModalContent";

interface ItemModalProps {
  children: React.ReactChild;
  id: string;
  modalOpen: boolean;
  modalAction?: () => void;
  item: Item | ItemWithOwnership;
  character?: CharacterName;
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
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)} _backdrop={{ backgroundColor: "layout.modalBackdrop" }} closeOnOverlayClick={preventClose}>
      <ModalContent>
        <ItemHeader>
          <ModalHeaderImage bgColor="base.background">
            <ItemImage item={item} w={105} character={character} />
          </ModalHeaderImage>
          <ItemDescription>
            <Text color="primary.700" flexWrap="wrap" lineHeight="18px" fontSize="xs">
              {item.description}
            </Text>
          </ItemDescription>
          <ModalCloseButton bgColor="base.background" />
        </ItemHeader>

        <ItemTitle title={item.name} ptCost={(buttonText === "BUY" && item.ptCost) ?? null} type={item.type} />

        {children}

        {item.type === "codex" && item.owned ? null : buttonText && <ItemModalActionButton disabled={disabled} buttonText={buttonText} action={() => handleModalAction(id, modalAction)} bgColor={buttonText === "USE" || buttonText === "BUY" ? "base.caution" : "base.success"} />}
      </ModalContent>
    </Modal>
  );
};

export default ItemModal;
