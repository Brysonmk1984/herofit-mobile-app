import { Button } from "native-base";
import React from "react";

interface ActionButtonProps {
  children: React.ReactChild;
  disabled?: boolean;
  action: () => any;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, action, disabled }) => {
  return (
    <Button bgColor={disabled ? "base.disabled" : "base.success"} onPress={action} shadow={3} _text={{ fontSize: "2xl", color: disabled ? "muted.500" : "base.white" }} disabled={disabled} borderTopRightRadius={0} borderTopLeftRadius={0}>
      {children}
    </Button>
  );
};
