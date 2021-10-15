import { Box } from "native-base";
import React from "react";
import { ReactChild } from "react-transition-group/node_modules/@types/react";

interface ScreenActionFixedWrapperProps {
  children: ReactChild | ReactChild[];
}

const ScreenActionFixedWrapper: React.FC<ScreenActionFixedWrapperProps> = ({ children }) => {
  return (
    <Box position="absolute" bottom={0} width="100%" bgColor="base.primary">
      {children}
    </Box>
  );
};

export default ScreenActionFixedWrapper;
