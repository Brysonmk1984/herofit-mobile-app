import React, { useContext, useEffect } from "react";
import { Text, Box, HStack } from "native-base";
import { FlatList } from "react-native";
import { ItemWithOwnership, Item, CharacterName, Effect } from "../../../../../../common/types";
import { GlobalStateContext } from "../../../../../../store";
import { ItemModal } from "../../../../../../Components/ModalTemplates/ModalTemplates";
import BodyContent from "../../../../../../Components/ModalTemplates/ItemModal/BodyContent";
import { capitalize } from "../../../../../../common/helperFunctions";

interface ItemDetailProps {
  id: string;
  item: Item | ItemWithOwnership;
  character?: CharacterName;
  modalAction?: () => void;
  closeModal?: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ id, modalAction, closeModal, item, character }) => {
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

        <Text color="primary.500" lineHeight={5}>
          {effect.description}
        </Text>
      </Box>
    );
  }

  useEffect(() => {
    if (item.effects) {
      item.effects = item.effects.reverse();
    }
  }, []);

  return (
    <ItemModal id={id} modalOpen={state.modalQueue[0] === id} buttonText="OK" modalAction={modalAction} item={item} character={character}>
      <BodyContent>
        {item.effects?.length && !item.lore && (
          <Text fontFamily="heading" fontSize="3xl" mb={3}>
            Effects
          </Text>
        )}
        <FlatList data={item.effects} renderItem={({ item }) => _renderEffect(item)} keyExtractor={(item, i) => i.toString()} />
      </BodyContent>
    </ItemModal>
  );
};

export default ItemDetail;
