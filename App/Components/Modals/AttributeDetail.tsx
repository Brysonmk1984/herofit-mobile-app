import React, { useContext, useMemo } from "react";
import { HStack, Box, Text } from "native-base";
import { FlatList, ScrollView } from "react-native";
import { AttrObj, Stat } from "../../common/types";
import { GlobalStateContext } from "../../store";
import AttributeModal from "../ModalTemplates/AttributeModal/AttributeModal";
import BodyContent from "../ModalTemplates/ItemModal/BodyContent";
import defaultStats from "../../common/defaultStats.json";
import useAspectRatio from "../../common/hooks/useAspectRatio";

interface AttributeDetailProps {
  id: string;
  attribute: Lowercase<Stat>;
}

const AttributeDetail: React.FC<AttributeDetailProps> = ({ id, attribute }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const attrObj: AttrObj = defaultStats.find(attr => attr.lcName === attribute) as AttrObj;
  const { deviceAspectType } = useMemo(() => useAspectRatio(), []);
  const isShortPhone = deviceAspectType === "short";

  function renderAttribute({ item }) {
    return (
      <HStack space={3}>
        <Text lineHeight="lg" fontSize="lg">
          &#8226;
        </Text>

        <Text flex={1} color="primary.700" lineHeight="lg" fontSize="md">
          {item}
        </Text>
      </HStack>
    );
  }

  return (
    <AttributeModal id={id} modalOpen={state.modalQueue[0] === id} attrObj={attrObj} isShortPhone={isShortPhone}>
      <BodyContent>
        <Box p={3}>
          {!isShortPhone && (
            <Box>
              <Text fontFamily="heading" fontSize="lg">
                Effects:
              </Text>
            </Box>
          )}

          <FlatList data={attrObj.descriptionArray} renderItem={item => renderAttribute(item)} />
        </Box>
      </BodyContent>
    </AttributeModal>
  );
};

export default AttributeDetail;
