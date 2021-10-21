import React from "react";
import { View, Text, ScrollView } from "native-base";
import { Icon } from "../../CustomComponents";

interface ItemTitleProps {
  title: string;
  ptCost: number;
}

const ItemTitle: React.FC<ItemTitleProps> = ({ title, ptCost }) => {
  return (
    <View flexWrap="wrap" justifyContent="center" flexDirection="row" bgColor="base.secondary" py={2}>
      <Text pt={1} color="white" textAlign="center" fontSize={title.length > 30 ? "2xl" : title.length > 25 ? "3xl" : "4xl"} fontFamily="heading">
        {title}
      </Text>
    </View>
  );
};

export default ItemTitle;
