import { Box } from "native-base";
import React from "react";

interface CharacterHeaderProps {
  children: React.ReactChild[];
}

export const CharacterHeader: React.FC<CharacterHeaderProps> = ({ children }) => {
  return (
    <Box flex={0.3} flexBasis={100} bgColor="base.background">
      {children}
    </Box>
  );
};
