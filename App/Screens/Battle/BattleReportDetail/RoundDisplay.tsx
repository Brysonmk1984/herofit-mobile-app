import React from "react";
import { View, Text } from "native-base";
import { BattleDetailOnly } from "../../../common/types-battle";

interface RoundDisplayProps {
  battleReport: BattleDetailOnly;
}

const RoundDisplay: React.FC<RoundDisplayProps> = ({ battleReport }) => {
  return (
    <View>
      <Text mt={10} fontSize={40} fontFamily="heading" textAlign="center">
        Round - By - Round
      </Text>
    </View>
  );
};

export default RoundDisplay;
