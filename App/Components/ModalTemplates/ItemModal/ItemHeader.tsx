import React from "react";
import { Box } from "native-base";

interface ItemHeaderProps {
  children: React.ReactChild[];
}

const ItemHeader: React.FC<ItemHeaderProps> = ({ children }) => {
  return (
    <Box justifyContent="center" minHeight={85} bgColor="base.background">
      {children}
    </Box>
  );
};

export default ItemHeader;
