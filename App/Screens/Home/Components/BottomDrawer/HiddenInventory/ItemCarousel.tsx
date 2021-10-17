import React from "react";
import { View, Text } from "native-base";
import { Item, ItemType } from "../../../../../common/types";

interface ItemCarouselProps {
  type: Lowercase<ItemType>;
  data: Item[];
  equipped?: Item;
}

const ItemCarousel: React.FC<ItemCarouselProps> = ({ type, data, equipped }) => {
  return (
    <View>
      <Text>{equipped?.name}</Text>
    </View>
  );
};
export default ItemCarousel;
