import { Box, Text } from "native-base";
import React from "react";
import { FoeAbility } from "../../common/types";

interface AdversaryAbilityProps {
  ability: FoeAbility;
  textDirection: "left" | "right";
  color?: string;
}

const AdversaryAbility: React.FC<AdversaryAbilityProps> = ({ ability, textDirection, color = "primary.800" }) => {
  return (
    <Box>
      <Text textAlign={textDirection} color={color}>
        {ability.name}
      </Text>
      <Text textAlign={textDirection} fontSize="xs" fontStyle="italic" color={color}>
        {ability.effect}
      </Text>
      <Text textAlign={textDirection} fontSize="xs" color={color}>
        ({ability.type})
      </Text>
    </Box>
  );
};

export default AdversaryAbility;
