import React from "react";
import { Box, Text } from "native-base";

interface HeroTitleProps {
  title: string;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ title }) => {
  return (
    <Box mt={-10} ml={12}>
      <Text ml={3} color="base.white">
        {title}
      </Text>
    </Box>
  );
};

export default HeroTitle;
