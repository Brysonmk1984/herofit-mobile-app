import React, { useContext } from "react";
import { CharacterName } from "../../../../common/types";
import { BodyContent } from "../../../../Components/ModalTemplates/BasicModal/Content";
import ItemLore from "../../../../Components/ModalTemplates/ItemModal/ItemLore";
import { DetailModal } from "../../../../Components/ModalTemplates/ModalTemplates";
import { GlobalStateContext } from "../../../../store";

interface HeroDescriptionProps {
  id: string;
  character: CharacterName;
  modalAction?: () => void;
  closeModal?: () => void;
}

const HeroDescription: React.FC<HeroDescriptionProps> = ({ id, character, modalAction, closeModal }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  return (
    <DetailModal id={id} modalOpen={state.modalQueue[0] === id} buttonText="OK" modalAction={modalAction} character={character}>
      <BodyContent>{/* <ItemLore lore={""} numEffects={0} fullCodex={false} /> */}</BodyContent>
    </DetailModal>
  );
};

export default HeroDescription;
