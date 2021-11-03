import React from "react";
import { Modal, Text, View, Box } from "native-base";
import ModalCloseButton from "../ModalCloseButton";
import ItemHeader from "./ItemHeader";
import ItemDescription from "./ItemDescription";
import { IActionHeader } from "../BasicModal/Content";
import useModal from "../../../common/hooks/useModal";
import { CharacterName, Item, ItemWithOwnership } from "../../../common/types";
import ItemModalActionButton from "./ItemModalActionButton";
import ItemImage from "../../../common/ItemImage";
import ModalHeaderImage from "../ModalHeaderImage";
import ItemTitle from "./ItemTitle";
import ItemLore from "./ItemLore";

interface ItemModalProps {
  children: React.ReactChild;
  id: string;
  modalOpen: boolean;
  modalAction?: () => void;
  item: Item | ItemWithOwnership;
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
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)} _backdrop={{ backgroundColor: "layout.modalBackdrop" }} closeOnOverlayClick={preventClose}>
      <Modal.Content p={0}>
        <Box pb={100}>
          <ItemHeader>
            <ModalHeaderImage bgColor="base.background">
              <ItemImage item={item} w={105} character={character} />
            </ModalHeaderImage>
            <ItemDescription>
              <Text textAlign="center" color="primary.700" flexWrap="wrap" lineHeight="18px" fontSize={15}>
                {item.description}
              </Text>
            </ItemDescription>
            <ModalCloseButton bgColor="base.background" />
          </ItemHeader>
          <View paddingBottom={74} overflow="hidden">
            <ItemTitle title={item.name} ptCost={(buttonText === "BUY" && item.ptCost) ?? null} />
            {item.lore && <ItemLore lore={item.lore} numEffects={item.effects?.length ?? 0} fullCodex={item.type === "codex" && item.owned} />}
            {children}
          </View>
        </Box>
        {item.type === "codex" && item.owned ? null : buttonText && <ItemModalActionButton disabled={disabled} buttonText={buttonText} action={() => handleModalAction(id, modalAction)} bgColor={buttonText === "USE" || buttonText === "BUY" ? "base.caution" : "base.success"} />}
      </Modal.Content>
    </Modal>
  );
};

export default ItemModal;
