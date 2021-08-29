import React from "react";
import { View, Button, Box, Modal } from "native-base";

interface ModalCloseButton {
  backgroundColor: string;
}

const ModalCloseButton: React.FC<ModalCloseButton> = ({ text, disabled, action, backgroundColor = "warmGray.50" }) => {
  return (
    <Box w={46} h={46} position="absolute" top={-15} right={-13} borderRadius={46 / 2} backgroundColor={backgroundColor}>
      <Modal.CloseButton position="absolute" left={-7} top={1} w="100%" />
    </Box>
  );
};

export default ModalCloseButton;
