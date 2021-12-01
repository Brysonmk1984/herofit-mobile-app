import React from "react";
import { Box } from "native-base";
import Icon from "../../Icon";
interface AttributeImageProps {
  attribute: Stat;
  size: number;
}

const AttributeImage: React.FC<AttributeImageProps> = ({ attribute, size }) => {
  return (
    <Box alignItems="center">
      <Icon iconName={attribute} size={size} color={`base.${attribute}`} />
    </Box>
  );
};

export default AttributeImage;
