import { Box, Text } from "native-base";
import React from "react";
import { FoeAbility } from "../../common/types";

interface AdversaryAbilityProps {
  ability: FoeAbility;
  textDirection: "left" | "right";
}

const AdversaryAbility: React.FC<AdversaryAbilityProps> = ({ ability, textDirection }) => {
  return (
    <Box>
      <Text textAlign={textDirection}>{ability.name}</Text>
      <Text textAlign={textDirection} fontSize="xs" fontStyle="italic">
        {ability.effect}
      </Text>
      <Text textAlign={textDirection} fontSize="xs" color="primary.800">
        ({ability.type})
      </Text>
    </Box>
  );
};

export default AdversaryAbility;
