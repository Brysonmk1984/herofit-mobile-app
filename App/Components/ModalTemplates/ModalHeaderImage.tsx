import { Box } from "native-base";
import React, { ReactChild } from "react";

interface ModalHeaderImageProps {
  children: ReactChild;
  bgColor?: string;
  zIndex?: number;
}

const ModalHeaderImage: React.FC<ModalHeaderImageProps> = ({ children, bgColor = "warmGray.50" }) => {
  return (
    <Box alignItems="center" justifyContent="center" bgColor={bgColor} borderRadius={105 / 2} w={105} h={105} position="absolute" left={-12} top={-20}>
      {children}
    </Box>
  );
};
export default ModalHeaderImage;
