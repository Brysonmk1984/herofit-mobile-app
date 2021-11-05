import React from "react";
import { View, Text } from "native-base";

interface ItemDescriptionProps {
  children: React.ReactChild;
  shadow?: number;
}

const ItemDescriptionProps: React.FC<ItemDescriptionProps> = ({ children }) => {
  return (
    <View zIndex={100} borderRadius={6} bgColor="base.white" ml={93} my={2} mr={6} p={1.5}>
      {children}
    </View>
  );
};

export default ItemDescriptionProps;
