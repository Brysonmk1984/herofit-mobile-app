import React from "react";
import { View, Text } from "native-base";

interface CharacterDialogProps {
  children: React.ReactChild;
}

export const CharacterDialog: React.FC<CharacterDialogProps> = ({ children }) => {
  return (
    <View shadow="5" borderRadius={8} backgroundColor="base.white" ml={95} my={2} mr={8} p={2}>
      {children}
    </View>
  );
};
