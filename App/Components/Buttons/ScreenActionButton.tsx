import React from "react";
import { Box, Button } from "native-base";

interface ScreenActionProps {
  text: string;
  action: () => void;
  disabled?: boolean;
  includeBorder?: boolean;
}

const ScreenActionButton: React.FC<ScreenActionProps> = ({ text, action, disabled, includeBorder = false }) => {
  return (
    <Box borderTopWidth={includeBorder ? 2 : 0} borderTopColor="primary.800" px={10} pt={2} pb={5}>
      <Button bgColor={disabled ? "base.disabled" : "base.success"} _text={{ fontFamily: "heading", fontSize: "3xl", lineHeight: 45, color: disabled ? "muted.500" : "base.white" }} disabled={disabled} onPress={action}>
        {text}
      </Button>
    </Box>
  );
};

export default ScreenActionButton;
