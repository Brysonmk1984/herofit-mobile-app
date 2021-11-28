import { Box } from "native-base";
import React, { ReactChild } from "react";

interface ModalContentProps {
  children: ReactChild | ReactChild[];
}

export const ModalContent: React.FC<ModalContentProps> = ({ children }) => {
  return (
    <Box w="90%" maxHeight="90%" overflow="visible" bgColor="base.white">
      {children}
    </Box>
  );
};
