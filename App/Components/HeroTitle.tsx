import React from "react";
import { Box, Text } from "native-base";
import { Icon } from "./CustomComponents";
import { Item } from "../common/types";
import { getColorFromClassName, getColorFromItemName } from "../common/helperFunctions";

interface HeroTitleProps {
  title?: Item;
  justifyContent?: "center" | "flex-start" | "flex-end";
  mt?: number;
  ml?: number;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ title, justifyContent = "center", mt = 0, ml = 0 }) => {
  let color;
  if (title) {
    color = title.class ? getColorFromClassName(title.class) : getColorFromItemName(title.name);
  }

  return (
    <Box mt={mt} ml={ml} minHeight={25}>
      {title && (
        <Box justifyContent={justifyContent} flexDirection="row" ml={2}>
          <Icon iconName={title.name} size={25} color={color} />
          <Text ml={3} color={color} fontSize="lg">
            {title.name}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default HeroTitle;
