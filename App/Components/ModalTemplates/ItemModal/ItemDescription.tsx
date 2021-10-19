import React from "react";
import { View, Text } from "native-base";

interface ItemDescriptionProps {
  children: React.ReactChild;
}

const ItemDescriptionProps: React.FC<ItemDescriptionProps> = ({ children }) => {
  return (
    <View shadow="5" borderRadius={8} backgroundColor="base.white" ml={95} my={2} mr={8} p={2}>
      {children}
    </View>
  );
};

export default ItemDescriptionProps;
