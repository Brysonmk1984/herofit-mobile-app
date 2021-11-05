import React from "react";
import { View, Text, ScrollView, Center, Box } from "native-base";
import { Icon } from "../../CustomComponents";
import { ServerItemType } from "../../../common/types";
import { convertItemTypeName, determineItemTypeColor } from "../../../common/helperFunctions";

interface ItemTitleProps {
  title: string;
  ptCost: number;
  type: ServerItemType;
}

const ItemTitle: React.FC<ItemTitleProps> = ({ title, ptCost, type }) => {
  return (
    <Box>
      <Center justifyContent="center" bgColor="base.secondary" py={2}>
        <Text flexWrap="wrap" color="white" textAlign="center" fontSize={title.length > 30 ? "xl" : title.length > 25 ? "2xl" : "3xl"} fontFamily="heading">
          {title}
        </Text>
        {ptCost && (
          <Text color="base.highlight" textAlign="center" fontSize="2xl" mt={-3}>
            {ptCost}
          </Text>
        )}
      </Center>
      <Center bgColor={determineItemTypeColor(type)} pt={0.6} pb={1}>
        <Text fontSize="md" color="base.white">
          {convertItemTypeName(type)}
        </Text>
      </Center>
    </Box>
  );
};

export default ItemTitle;
