import React from "react";
import { View, Text } from "native-base";

interface ItemDescriptionProps {
  children: React.ReactChild;
  shadow?: number;
}

const ItemDescriptionProps: React.FC<ItemDescriptionProps> = ({ children }) => {
  return (
    <View borderRadius={8} bgColor="base.white" ml={100} my={2} mr={8} p={1.5}>
      {children}
    </View>
  );
};

export default ItemDescriptionProps;
