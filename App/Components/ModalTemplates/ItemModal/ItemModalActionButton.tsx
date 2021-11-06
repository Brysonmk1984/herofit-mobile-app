import React from "react";
import { View, Button, Box } from "native-base";

interface ItemModalActionButton {
  buttonText: string;
  disabled?: boolean;
  action: () => void;
  bgColor?: string;
}

const ItemModalActionButton: React.FC<ItemModalActionButton> = ({ buttonText, disabled, action, bgColor = "base.success" }) => {
  return (
    <Box flex={1} flexBasis={70} justifyContent="flex-end">
      <Button mb={2} bgColor={disabled ? "base.disabled" : bgColor} shadow={3} py={2} _text={{ fontFamily: "heading", fontSize: "4xl", lineHeight: 45, color: disabled ? "muted.500" : "base.white" }} disabled={disabled} onPress={action} borderTopRightRadius={0} borderTopLeftRadius={0}>
        {buttonText}
      </Button>
    </Box>
  );
};

export default ItemModalActionButton;
