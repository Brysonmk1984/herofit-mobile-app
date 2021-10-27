import React from "react";
import { View, Text, ScrollView, Center } from "native-base";
import { Icon } from "../../CustomComponents";

interface ItemTitleProps {
  title: string;
  ptCost: number;
}

const ItemTitle: React.FC<ItemTitleProps> = ({ title, ptCost }) => {
  return (
    <Center justifyContent="center" bgColor="base.secondary" py={2}>
      <Text flexWrap="wrap" pt={1} color="white" textAlign="center" fontSize={title.length > 30 ? "2xl" : title.length > 25 ? "3xl" : "4xl"} fontFamily="heading">
        {title}
      </Text>
      {ptCost && (
        <Text color="base.highlight" textAlign="center" fontSize="2xl" mt={-3}>
          {ptCost}
        </Text>
      )}
    </Center>
  );
};

export default ItemTitle;
