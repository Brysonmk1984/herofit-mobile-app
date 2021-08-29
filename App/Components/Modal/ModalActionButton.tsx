import React from "react";
import { View, Button } from "native-base";

interface ModalActionButton {
  text: string;
  disabled?: boolean;
  action: () => void;
}

const ModalActionButton: React.FC<ModalActionButton> = ({ text, disabled, action }) => {
  return (
    <Button shadow={3} mb={2} w="100%" py={3} _text={{ fontSize: "3xl", fontFamily: "heading" }} disabled={disabled} onPress={action} borderTopRightRadius={0} borderTopLeftRadius={0}>
      {text}
    </Button>
  );
};

export default ModalActionButton;
