import React from "react";
import { useTheme, View } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";

interface SpiralBackgroundProps {
  outcome: string;
}

const SpiralBackground: React.FC<SpiralBackgroundProps> = ({ outcome }) => {
  const backgroundImage = require("../../../assets/images/backgrounds/battle-report-background.webp");
  const { colors } = useTheme();

  return (
    <View opacity={0.7} bgColor="base.white" position="absolute" w="100%" h="100%">
      <View bgColor={outcome === "Avatar Wins" ? colors.base.highlight : colors.base.lowlight} w="100%" h="100%">
        <ImageBackground style={styles.backgroundImage} source={backgroundImage} resizeMode="cover" opacity={0.6} />
      </View>
    </View>
  );
};
export default SpiralBackground;

const styles = StyleSheet.create({
  backgroundImage: { position: "absolute", width: "100%", height: "100%", zIndex: 0 },
});
