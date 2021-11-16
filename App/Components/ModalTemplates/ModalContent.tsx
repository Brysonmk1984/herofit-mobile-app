import { Box } from "native-base";
import React, { ReactChild } from "react";

interface ModalContentProps {
  children: ReactChild | ReactChild[];
}

export const ModalContent: React.FC<ModalContentProps> = ({ children }) => {
  return (
    <Box w="85%" maxHeight="80%" overflow="visible" bgColor="base.white">
      {children}
    </Box>
  );
};
