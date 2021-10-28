import React from "react";
import { StyleSheet } from "react-native";
import { VStack, Text, Pressable, Box } from "native-base";
import { CountdownTimer } from "../../Home/Components/TopHud/CountdownTimer";
import { LinearGradient } from "expo-linear-gradient";
import herofitTheme from "../../../styles/herofitTheme";

interface VsSectionProps {
  height: number;
  handleNavigation: () => void;
}

const VsSection: React.FC<VsSectionProps> = ({ height, handleNavigation }) => {
  const vsColors = ["transparent", "#ffffff", "transparent"];

  return (
    <VStack zIndex={100} h={height * 0.45} w="100%" justifyContent="center" alignItems="center" position="absolute" top={height * 0.26}>
      <LinearGradient colors={vsColors} style={styles.vsGradient} alignItems="center" />
      <Pressable onPress={() => handleNavigation()}>
        <Box justifyContent="center" alignItems="center">
          <Text style={styles.textShadow} mt={-10} mb={-5} fontSize={140} fontFamily="heading">
            VS
          </Text>
          <CountdownTimer fontSize={30} hideType={true} type={"Battle"} />
        </Box>
      </Pressable>
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
