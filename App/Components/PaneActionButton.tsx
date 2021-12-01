import React from "react";
import { Button, Center } from "native-base";

interface PaneActionButtonProps {
  text: string;
  disabled?: boolean;
  action: () => void;
}

const PaneActionButton: React.FC<PaneActionButtonProps> = ({ text, disabled, action }) => {
  return (
    <Center>
      <Button bgColor={disabled ? "base.disabled" : undefined} _text={{ fontFamily: "heading", fontSize: "3xl", lineHeight: 45, color: disabled ? "muted.500" : "base.white" }} w="100%" disabled={disabled ? true : false} onPress={action}>
        {text}
      </Button>
    </Center>
  );
};

export default PaneActionButton;
