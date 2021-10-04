import React from "react";
import { StyleSheet } from "react-native";
import { View, Box, Text, Image, Pressable } from "native-base";
import { thousandsFormat } from "../../../../common/helperFunctions";
import { useNavigation } from "@react-navigation/native";

interface PtAndQpMenuProps {
  photonTokens: number;
  qp: number;
  windowWidth: number;
}

export const PtAndQpMenu: React.FC<PtAndQpMenuProps> = ({ photonTokens, qp, windowWidth }) => {
  const navigation = useNavigation();
  //qp = 0;
  return (
    <View>
      {/* Left: PT Menu */}
      <View alignSelf="center" style={[styles.trapezoid, styles.trapezoidLeft, { width: windowWidth * 0.31 }]}>
        <Box flexDirection="row" alignItems="center" position={"absolute"} ml={1}>
          <Image size={35} source={require("../../../../../assets/images/misc/photon_stack.webp")} alt="Photon Tokens" />
          <Text ml={3} mb={-2} fontSize={20} color="base.highlight">
            {thousandsFormat(photonTokens)}
          </Text>
        </Box>
      </View>
      {/* Right: QP Menu */}

      <View alignSelf="center" style={[styles.trapezoid, styles.trapezoidRight, { width: windowWidth * 0.31 }]}>
        <Pressable h={40} w={windowWidth * 0.31} alignItems="center" onPress={() => navigation.push("App", { screen: "SpendQP" })}>
          {qp ? (
            <View flexDirection="row">
              <Text lineHeight={40} fontFamily="heading" color="primary.800" fontSize={20}>
                QP:
              </Text>
              <Text ml={2} lineHeight={40} fontFamily="heading" color="base.highlight" fontSize={25}>
                {qp}
              </Text>
            </View>
          ) : (
            <Text lineHeight={40} fontFamily="heading" color="primary.800" fontSize={20}>
              Quantum
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trapezoid: {
    height: 0,
    borderBottomWidth: 50,
    borderBottomColor: "#242423",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderStyle: "solid",
    position: "absolute",
  },
  trapezoidLeft: {
    borderLeftWidth: 0,
    borderRightWidth: 20,
    left: 0,
  },
  trapezoidRight: {
    borderLeftWidth: 20,
    borderRightWidth: 0,
    right: 0,
  },
  bottomDrawer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
