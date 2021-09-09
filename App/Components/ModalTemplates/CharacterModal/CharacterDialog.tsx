import React from "react";
import { View, Text } from "native-base";

interface CharacterDialogProps {
  children: React.ReactChild;
}

export const CharacterDialog: React.FC<CharacterDialogProps> = ({ children }) => {
  return (
    <View ml={100} py={5} pr={1}>
      {children}
    </View>
  );
};
