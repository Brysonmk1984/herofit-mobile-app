import React from "react";
import { StyleSheet } from "react-native";
import { View, Box, Image, Text } from "native-base";
import { thousandsFormat } from "../../../../../common/helperFunctions";

interface PtContainerProps {
  photonTokens: number;
}

export const PtContainer: React.FC<PtContainerProps> = ({ photonTokens }) => {
  photonTokens = 2000;
  return (
    <View w={50} ml={1} mt={-55}>
      <Box ml={-20} mt={-12} alignItems="center">
        <Box mt={-4} style={styles.triangle}></Box>
        <Box alignItems="center" mt={-12} ml={4} mr={-12}>
          <Image size={25} source={require("../../../../../../assets/images/misc/photon_stack.webp")} alt="Photon Tokens" />
          <Text ml={1} mt={-1} fontSize={15} color="base.highlight">
            {thousandsFormat(photonTokens)}
          </Text>
        </Box>
      </Box>
    </View>
  );
};

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 80,
    borderRightWidth: 80,
    borderBottomWidth: 120,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#242423",
  },
});
