import React from "react";
import { View, Button, Box } from "native-base";

interface CharacterModalActionButton {
  buttonText: string;
  disabled?: boolean;
  action: () => void;
}

const CharacterModalActionButton: React.FC<CharacterModalActionButton> = ({ buttonText, disabled, action }) => {
  return (
    <Box flex={1} flexBasis={70} justifyContent="flex-end">
      <Button mb={2} bgColor={disabled ? "base.disabled" : "base.success"} shadow={3} _text={{ fontFamily: "heading", fontSize: "4xl", lineHeight: 45, color: disabled ? "muted.500" : "base.white" }} disabled={disabled} onPress={action} borderTopRightRadius={0} borderTopLeftRadius={0}>
        {buttonText.toUpperCase()}
      </Button>
    </Box>
  );
};

export default CharacterModalActionButton;
