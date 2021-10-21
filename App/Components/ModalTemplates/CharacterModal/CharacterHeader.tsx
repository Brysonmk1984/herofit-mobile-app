import { Box } from "native-base";
import React from "react";

interface CharacterHeaderProps {
  children: React.ReactChild[];
}

export const CharacterHeader: React.FC<CharacterHeaderProps> = ({ children }) => {
  return (
    <Box minHeight={85} bgColor="base.background">
      {children}
    </Box>
  );
};
