import React, { useContext, useEffect } from "react";
import { Text, Box, HStack } from "native-base";
import { FlatList } from "react-native";
import { ItemWithOwnership, Item, CharacterName, Effect } from "../../../../../../common/types";
import { GlobalStateContext } from "../../../../../../store";
import { ItemModal } from "../../../../../../Components/ModalTemplates/ModalTemplates";
import BodyContent from "../../../../../../Components/ModalTemplates/ItemModal/BodyContent";
import { capitalize } from "../../../../../../common/helperFunctions";
import ItemLore from "../../../../../../Components/ModalTemplates/ItemModal/ItemLore";

interface ItemDetailProps {
  id: string;
  item: Item | ItemWithOwnership;
  character?: CharacterName;
  buttonText?: "USE" | "BUY" | "OK";
  modalAction?: () => void;
  closeModal?: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ id, buttonText = "OK", modalAction, closeModal, item, character }) => {
  const { state, dispatch } = useContext(GlobalStateContext);

  function _renderEffect(effect: Effect) {
    return (
      <Box px={5} mb={2}>
        <HStack justifyContent="space-between">
          <Text fontFamily="heading" mt={1}>
            {effect.name}
          </Text>
          <Text color="success.500">{capitalize(effect.type)}</Text>
        </HStack>

        <Text color="primary.500">{effect.description}</Text>
      </Box>
    );
  }

  useEffect(() => {
    if (item.effects) {
      item.effects = item.effects.reverse();
    }
  }, [item]);

  return (
    <ItemModal id={id} modalOpen={state.modalQueue[0] === id} buttonText={buttonText} modalAction={modalAction} item={item} character={character}>
      <BodyContent>
        <FlatList ListHeaderComponent={item.lore && <ItemLore lore={item.lore} numEffects={item.effects?.length ?? 0} fullCodex={item.type === "codex" && item.owned} />} data={item.effects} renderItem={({ item }) => _renderEffect(item)} keyExtractor={(item, i) => i.toString()} />
      </BodyContent>
    </ItemModal>
  );
};

export default ItemDetail;
