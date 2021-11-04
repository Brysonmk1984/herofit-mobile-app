import React from "react";
import { View, Button, Box, Modal } from "native-base";

interface ModalCloseButton {
  bgColor: string;
}

const ModalCloseButton: React.FC<ModalCloseButton> = ({ bgColor = "warmGray.50" }) => {
  return (
    <Box w={46} h={46} position="absolute" top={-15} right={-13} borderRadius={46 / 2} bgColor={bgColor}>
      <Modal.CloseButton position="absolute" left={-7} top={2} w="100%" />
    </Box>
  );
};

export default ModalCloseButton;
