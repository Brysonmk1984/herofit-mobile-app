import React, { useContext } from "react";
import { Text, Box } from "native-base";
import { ActionHeader, BodyContent } from "../../../../../../Components/ModalTemplates/BasicModal/Content";
import { Activity, ItemWithOwnership, InitialAppState, Item, CharacterName } from "../../../../../../common/types";
import { GlobalStateContext } from "../../../../../../store";
import { ItemModal } from "../../../../../../Components/ModalTemplates/ModalTemplates";

interface ItemDetailProps {
  id: string;
  item: Item | ItemWithOwnership;
  character?: CharacterName;
  modalAction?: () => void;
  closeModal?: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ id, modalAction, closeModal, item, character }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  return (
    <ItemModal id={id} modalOpen={state.modalQueue[0] === id} buttonText="OK" modalAction={modalAction} item={item} character={character}>
      <ActionHeader type="info" text={item.name} />
      <BodyContent>
        <Text>THIS IS A TEST</Text>
      </BodyContent>
    </ItemModal>
  );
};

export default ItemDetail;
