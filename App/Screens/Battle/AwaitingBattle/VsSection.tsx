import React from "react";
import { StyleSheet } from "react-native";
import { VStack, Text } from "native-base";
import { CountdownTimer } from "../../Home/Components/TopHud/CountdownTimer";
import { LinearGradient } from "expo-linear-gradient";
import herofitTheme from "../../../styles/herofitTheme";

interface VsSectionProps {
  height: number;
}

const VsSection: React.FC<VsSectionProps> = ({ height }) => {
  const vsColors = ["transparent", "#ffffff", "#ffffff", "transparent"];
  return (
    <VStack h={height * 0.45} w="100%" justifyContent="center" alignItems="center" position="absolute" top={height * 0.25}>
      <LinearGradient colors={vsColors} style={styles.vsGradient} />
      <Text style={styles.textShadow} mt={-10} mb={-35} fontSize={140} fontFamily="heading">
        VS
      </Text>
      <CountdownTimer hideType={true} type={"Battle"} />
    </VStack>
  );
};

export default VsSection;

const { textShadowColor } = herofitTheme.colors.base;
const styles = StyleSheet.create({
  vsGradient: { height: "100%", width: "100%", position: "absolute" },
  textShadow: {
    textShadowColor: textShadowColor,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
});
