import React, { useContext, useEffect } from "react";
import { Text, Box, HStack } from "native-base";
import { FlatList } from "react-native";
import { ItemWithOwnership, Item, CharacterName, Effect } from "../../../../../../common/types";
import { GlobalStateContext } from "../../../../../../store";
import { ItemModal } from "../../../../../../Components/ModalTemplates/ModalTemplates";
import BodyContent from "../../../../../../Components/ModalTemplates/ItemModal/BodyContent";
import { capitalize } from "../../../../../../common/helperFunctions";
import ItemLore from "../../../../../../Components/ModalTemplates/ItemModal/ItemLore";
import Icon from "../../../../../../Components/Icon";

interface ItemDetailProps {
  id: string;
  item: Item | ItemWithOwnership;
  character?: CharacterName;
  buttonText?: "USE" | "BUY" | "OK";
  modalAction?: () => void;
  closeModal?: () => void;
  disabled?: boolean;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ id, buttonText = "OK", modalAction, closeModal, item, character, disabled }) => {
  const { state, dispatch } = useContext(GlobalStateContext);

  function _renderEffect(effect: Effect) {
    return (
      <Box px={3} mt={2} mb={3}>
        <HStack justifyContent="space-between">
          <Text mt={1}>
            <Text>
              <Icon iconName="bullseye" size={16} color="primary.800" />
              &nbsp;
            </Text>
            <Text fontFamily="heading" fontSize="lg">
              {effect.name}
            </Text>
          </Text>

          <Text color="success.500" fontSize="md">
            {capitalize(effect.type)}
          </Text>
        </HStack>

        <Text color="primary.500" fontSize="md" ml={5}>
          {effect.description}
        </Text>
      </Box>
    );
  }

  useEffect(() => {
    if (item.effects) {
      item.effects = item.effects.reverse();
    }
  }, [item]);

  return (
    <ItemModal id={id} modalOpen={state.modalQueue[0] === id} buttonText={buttonText} modalAction={modalAction} item={item} character={character} disabled={disabled}>
      <BodyContent>
        <FlatList ListHeaderComponent={item.lore && <ItemLore lore={item.lore} numEffects={item.effects?.length ?? 0} fullCodex={item.type === "codex" && item.owned} />} data={item.effects} renderItem={({ item }) => _renderEffect(item)} keyExtractor={(item, i) => i.toString()} contentContainerStyle={{ paddingBottom: 15 }} />
      </BodyContent>
    </ItemModal>
  );
};

export default ItemDetail;
