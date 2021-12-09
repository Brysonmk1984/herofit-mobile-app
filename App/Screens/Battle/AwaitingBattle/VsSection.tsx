import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { VStack, Text, Pressable, Box } from "native-base";
import { CountdownTimer } from "../../Home/Components/TopHud/CountdownTimer";
import { LinearGradient } from "expo-linear-gradient";
import herofitTheme from "../../../styles/herofitTheme";

interface VsSectionProps {
  height: number;
  handleNavigation: () => void;
  isLongPhone: boolean;
  disableCountdown: boolean;
}

const VsSection: React.FC<VsSectionProps> = ({ height, handleNavigation, isLongPhone, disableCountdown }) => {
  return (
    <VStack zIndex={100} h={height * 0.5} w="100%" position="absolute" top={isLongPhone ? height * 0.28 : height * 0.32}>
      <Pressable onPress={() => handleNavigation()}>
        <ImageBackground
          style={{
            width: "100%",
            height: height * 0.4,
          }}
          source={require("../../../../assets/images/layout/battle-gradient.webp")}
          resizeMode="stretch"
        >
          <Box h="100%" justifyContent="center" alignItems="center">
            <Text style={styles.textShadow} mt={0} fontSize={140} fontFamily="heading">
              VS
            </Text>
            {!disableCountdown && (
              <Box mt={-45} mb={35}>
                <CountdownTimer fontSize={40} hideType={true} type={"Battle"} />
              </Box>
            )}
          </Box>
        </ImageBackground>
      </Pressable>
    </VStack>
  );
};

export default VsSection;

const { textShadowColor } = herofitTheme.colors.base;
const styles = StyleSheet.create({
  textShadow: {
    textShadowColor: textShadowColor,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
});
