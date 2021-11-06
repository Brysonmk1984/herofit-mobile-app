import React from "react";
import { View, Text } from "native-base";

interface CharacterDialogProps {
  children: React.ReactChild | React.ReactChild[];
}

export const CharacterDialog: React.FC<CharacterDialogProps> = ({ children }) => {
  return (
    <View shadow="5" borderRadius={8} bgColor="base.white" ml={95} mt={2} mr={8} p={2}>
      {children}
    </View>
  );
};
