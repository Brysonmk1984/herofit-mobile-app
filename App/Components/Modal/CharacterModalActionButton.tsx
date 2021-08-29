import React from "react";
import { View, Button } from "native-base";

interface CharacterModalActionButton {
  text: string;
  disabled?: boolean;
  action: () => void;
}

const CharacterModalActionButton: React.FC<CharacterModalActionButton> = ({ text, disabled, action }) => {
  return (
    <Button position="absolute" bottom={0} left={1} shadow={3} mb={2} w="93%" py={3} _text={{ fontSize: "3xl", fontFamily: "heading" }} disabled={disabled} onPress={action} borderTopRightRadius={0} borderTopLeftRadius={0}>
      {text}
    </Button>
  );
};

export default CharacterModalActionButton;
