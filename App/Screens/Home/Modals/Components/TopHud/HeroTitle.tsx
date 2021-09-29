import React from "react";
import { Box, Text } from "native-base";
import { Icon } from "../../../../../Components/CustomComponents";
import { Item } from "../../../../../common/types";
import { getColorFromClassName, getColorFromItemName } from "../../../../../common/helperFunctions";

interface HeroTitleProps {
  title: Item;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ title }) => {
  const { name, class: className } = title;
  const color = className ? getColorFromClassName(className) : getColorFromItemName(name);
  return (
    <Box mt={-10} ml={12}>
      <Box flexDirection="row" ml={2}>
        <Icon iconName={name} size={25} color={color} />
        <Text ml={3} color={color}>
          {name}
        </Text>
      </Box>
    </Box>
  );
};

export default HeroTitle;
