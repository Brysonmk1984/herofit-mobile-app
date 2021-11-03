import React from "react";
import { View, Button } from "native-base";

interface ItemModalActionButton {
  buttonText: string;
  disabled?: boolean;
  action: () => void;
  bgColor?: string;
}

const ItemModalActionButton: React.FC<ItemModalActionButton> = ({ buttonText, disabled, action, bgColor = "base.success" }) => {
  return (
    <Button bgColor={disabled ? "base.disabled" : bgColor} position="absolute" bottom={0} left={1} shadow={3} mb={2} w="93%" py={3} _text={{ fontSize: "2xl", color: disabled ? "muted.500" : "base.white" }} disabled={disabled} onPress={action} borderTopRightRadius={0} borderTopLeftRadius={0}>
      {buttonText}
    </Button>
  );
};

export default ItemModalActionButton;
