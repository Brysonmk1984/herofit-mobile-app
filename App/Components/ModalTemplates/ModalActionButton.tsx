import { Box, Button } from "native-base";
import React from "react";

interface ActionButtonProps {
  children: React.ReactChild;
  disabled?: boolean;
  action: () => any;
}

const ModalActionButton: React.FC<ActionButtonProps> = ({ children, action, disabled }) => {
  return (
    <Box flex={1} flexBasis={70} justifyContent="flex-end">
      <Button mb={2} bgColor={disabled ? "base.disabled" : "base.success"} onPress={action} shadow={3} _text={{ fontFamily: "heading", fontSize: "4xl", lineHeight: 45, color: disabled ? "muted.500" : "base.white" }} disabled={disabled} borderTopRightRadius={0} borderTopLeftRadius={0}>
        {children}
      </Button>
    </Box>
  );
};

export default ModalActionButton;
