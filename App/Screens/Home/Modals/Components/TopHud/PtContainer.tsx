import React from "react";
import { View, Box, Image, Text } from "native-base";
import { thousandsFormat } from "../../../../../common/helperFunctions";

interface PtContainerProps {
  photonTokens: number;
}

export const PtContainer: React.FC<PtContainerProps> = ({ photonTokens }) => {
  photonTokens = 2000;
  return (
    <View w={50} ml={1} mt={-50}>
      <Box mt={3} alignItems="center">
        <Image size={35} source={require("../../../../../../assets/images/misc/photon_stack.webp")} alt="Photon Tokens" />
        <Text ml={1} mt={-1} fontSize={20} color="base.highlight">
          {thousandsFormat(photonTokens)}
        </Text>
      </Box>
    </View>
  );
};
