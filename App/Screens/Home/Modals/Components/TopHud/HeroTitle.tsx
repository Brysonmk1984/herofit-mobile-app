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
  console.log("C", color);
  return (
    <Box flexDirection="row" mt={-10} ml={12}>
      <Icon iconName="belt" size={25} color={color} />
      <Text ml={3} color="base.white">
        {name}
      </Text>
    </Box>
  );
};

export default HeroTitle;
