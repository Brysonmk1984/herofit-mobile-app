import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { Flex, View, Box, Pressable } from "native-base";
import herofitTheme from "../../styles/herofitTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import PressableWrapper from "./PressableWrapper";

interface ScreenContainerProps {
  children: React.ReactNode;
  screenName?: string;
  bg?: string | React.ReactElement;
  bgColor?: string;
  hero?: string;
  screenAction?: () => void;
}

function determineImageBackground({ type, name }: { type: string; name: string }) {
  if (type === "art") {
    switch (name) {
      case "SignIn":
      case "ForgotPassword":
        return require("../../../assets/images/backgrounds/pets-background.webp");
      case "Register":
        return require("../../../assets/images/backgrounds/pets-background-2.webp");
      case "SelectHeroHowTo":
        return require("../../../assets/images/backgrounds/repete-background.webp");
      case "SelectHero":
        return require("../../../assets/images/backgrounds/hero-selection-background.webp");
      case "SpendQP":
        return require("../../../assets/images/backgrounds/solar-warrior-background.webp");
      case "Activity":
        return require("../../../assets/images/backgrounds/natural-ninja-background.webp");
      case "AboutGame":
        return require("../../../assets/images/backgrounds/boulder-bro-background.webp");
      case "Splash":
        return require("../../../assets/images/backgrounds/splash-background-day.webp");
      case "Loading":
        return require("../../../assets/images/backgrounds/splash-background-night.webp");
      case "Adversaries":
        return require("../../../assets/images/backgrounds/adversaries-background.webp");
      case "BattleReport":
      case "BattleReportDetail":
        return;
      default:
        return require("../../../assets/images/backgrounds/hero-selection-background.webp");
    }
  } else if ((type = "hero")) {
    switch (name) {
      case "Boulder Bro":
        return require("../../../assets/images/backgrounds/selection/boulder-bro-select-background.webp");
      case "Solar Warrior":
        return require("../../../assets/images/backgrounds/selection/solar-warrior-select-background.webp");
      case "Natural Ninja":
        return require("../../../assets/images/backgrounds/selection/natural-ninja-select-background.webp");
      case "Wildspeaker":
        return require("../../../assets/images/backgrounds/selection/wildspeaker-select-background.webp");
      case "Empath":
        return require("../../../assets/images/backgrounds/selection/empath-select-background.webp");
      case "Filtron Five":
        return require("../../../assets/images/backgrounds/selection/filtron-five-select-background.webp");
      case "Scavenger Robot":
        return require("../../../assets/images/backgrounds/selection/scavenger-robot-select-background.webp");
      case "Timber Terror":
        return require("../../../assets/images/backgrounds/selection/timber-terror-select-background.webp");
      case "Compost Creature":
        return require("../../../assets/images/backgrounds/selection/compost-creature-select-background.webp");
      case "Chrono Guy":
        return require("../../../assets/images/backgrounds/selection/chrono-guy-select-background.webp");
      default:
        return require("../../../assets/images/backgrounds/selection/boulder-bro-select-background.webp");
    }
  }
}

export default function ScreenContainer({ children, screenName, bg, bgColor, hero, screenAction }: ScreenContainerProps) {
  let image = determineImageBackground({ type: "art", name: screenName });

  if (hero) {
    image = determineImageBackground({ type: "hero", name: hero });
  }

  function renderContent() {}

  return (
    <PressableWrapper isPressable={typeof screenAction === "function"} wrapper={children => <Pressable onPress={() => screenAction()}>{children}</Pressable>}>
      <View style={[styles.wrapper, styles.absolute, bgColor ? { backgroundColor: bgColor } : null]}>
        <SafeAreaView style={styles.container}>
          <Flex flex={1} justify="space-between" zIndex={10} p={0} w={"100%"} mx="auto">
            {children}
          </Flex>
        </SafeAreaView>
      </View>
      {typeof bg === "object" ? bg : <ImageBackground source={image} style={[styles.image, { backgroundColor: undefined }]} resizeMode="cover" />}
    </PressableWrapper>
  );
}

const { background, white, black } = herofitTheme.colors.base;
const styles = StyleSheet.create({
  wrapper: {
    marginTop: -2,
    elevation: 100,
    zIndex: 100,
  },
  container: {
    height: "100%",
    elevation: 100,
    zIndex: 100,
    overflow: "hidden",
  },
  absolute: {},
  image: {
    justifyContent: "center",
    width: "107%",
    height: "107%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 0,
    elevation: 0,
    backgroundColor: background,
    overflow: "hidden",
  },
});
