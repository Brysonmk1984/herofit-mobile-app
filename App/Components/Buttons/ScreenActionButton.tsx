import React from "react";
import { View, Button } from "native-base";

interface ScreenActionProps {
  text: string;
  disabled?: boolean;
  action: () => void;
}

const ScreenActionButton: React.FC<ScreenActionProps> = ({ text, disabled, action }) => {
  return (
    <View mx={50} my={3}>
      <Button bgColor={disabled ? "base.disabled" : "base.success"} _text={{ fontFamily: "heading", fontSize: "3xl", lineHeight: 45, color: disabled ? "muted.500" : "base.white" }} disabled={disabled} onPress={action}>
        {text}
      </Button>
    </View>
  );
};

export default ScreenActionButton;
