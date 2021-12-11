import React from "react";
import { Text, View, Button, Box, Modal } from "native-base";

interface ModalCloseButton {
  bgColor: string;
}

const ModalCloseButton: React.FC<ModalCloseButton> = ({ bgColor = "warmGray.50" }) => {
  return (
    <Box w={46} h={46} position="absolute" top={-15} right={-13} borderRadius={46 / 2} bgColor={bgColor}>
      <Modal.CloseButton _icon={{ size: 4 }} position="absolute" left={-7} top={1.5} w="100%" />
    </Box>
  );
};

export default ModalCloseButton;
