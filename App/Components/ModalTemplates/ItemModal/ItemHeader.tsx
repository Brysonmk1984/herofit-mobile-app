import React from "react";
import { Box } from "native-base";

interface ItemHeaderProps {
  children: React.ReactChild[];
}

const ItemHeader: React.FC<ItemHeaderProps> = ({ children }) => {
  return (
    <Box flex={0.2} flexBasis={85} justifyContent="center" bgColor="base.background">
      {children}
    </Box>
  );
};

export default ItemHeader;
