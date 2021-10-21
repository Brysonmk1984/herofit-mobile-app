import { View, Text, Image } from "native-base";
import React from "react";

interface ItemLoreProps {
  lore: string;
  numEffects: number;
}

const ItemLore: React.FC<ItemLoreProps> = ({ lore, numEffects }) => {
  return (
    <View zIndex={100} flexWrap="wrap" justifyContent="center" flexDirection="row" bgColor="base.background" py={2}>
      <Text mt={-1} pb={1} px={2} bgColor="base.background" fontFamily="cursive">
        {numEffects > 1 ? `${lore.slice(0, 150)}...` : lore.length > 250 ? `${lore.slice(0, 250)}...` : lore}
      </Text>
      <Image position="absolute" bottom={-10} source={require("../../../../assets/images/layout/torn-paper.webp")} alt={null} />
    </View>
  );
};

export default ItemLore;
