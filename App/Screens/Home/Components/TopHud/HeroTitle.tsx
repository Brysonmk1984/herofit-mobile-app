import React from "react";
import { Box, Text } from "native-base";
import { Icon } from "../../../../Components/CustomComponents";
import { Item } from "../../../../common/types";
import { getColorFromClassName, getColorFromItemName } from "../../../../common/helperFunctions";

interface HeroTitleProps {
  title?: Item;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ title }) => {
  let color;
  if (title) {
    color = title.class ? getColorFromClassName(title.class) : getColorFromItemName(title.name);
  }

  return (
    <Box mt={-10} ml={12} minHeight={25}>
      {title && (
        <Box flexDirection="row" ml={2}>
          <Icon iconName={title.name} size={25} color={color} />
          <Text ml={3} color={color}>
            {title.name}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default HeroTitle;
