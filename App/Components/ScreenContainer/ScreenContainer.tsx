import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { Flex, View } from "native-base";
import herofitTheme from "../../styles/herofitTheme";

interface ScreenContainerProps {
  children: React.ReactNode;
  screenName?: string;
  bg?: string;
  hero?: string;
  fullWidth?: boolean;
}

function determineImageBackground({ type, name }) {
  if (type === "art") {
    switch (name) {
      case "SignIn":
        return require("../../../assets/images/backgrounds/pets-background.webp");
      case "Register":
        return require("../../../assets/images/backgrounds/pets-background-2.webp");
      case "SelectHeroHowTo":
        return require("../../../assets/images/backgrounds/repete-background.webp");
      case "SelectHero":
        return require("../../../assets/images/backgrounds/hero-selection-background.webp");
      // case 'HeroDetails':
      //   return require('../../../assets/images/backgrounds/pets-background.webp');
      case "FinalizeHeroSelection":
        return require("../../../assets/images/backgrounds/pets-background-2.webp");
      case "SpendQP":
        return require("../../../assets/images/backgrounds/qp-background.webp");
      // case 'HeroDetails':
      //   return require('../../../assets/images/backgrounds/selection/boulder-bro-select-background.webp');
      case "Splash":
        return require("../../../assets/images/backgrounds/splash-background-day.webp");
      case "Loading":
        return require("../../../assets/images/backgrounds/splash-background-night.webp");
      default:
        return require("../../../assets/images/backgrounds/repete-background.webp");
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

export default function ScreenContainer({ children, screenName, bg, hero, fullWidth = false }: ScreenContainerProps) {
  let image = determineImageBackground({ type: "art", name: screenName });

  if (hero) {
    image = determineImageBackground({ type: "hero", name: hero });
  }

  return (
    <View style={[fullWidth ? { ...styles.container, ...styles.fullWidth } : styles.container, styles.absolute, styles.dropShadow]}>
      <Flex flex={1} justify="space-between" zIndex={10} p={0} w={"100%"} mx="auto">
        {children}
      </Flex>
      <ImageBackground source={image} style={[styles.image, { backgroundColor: bg }]} resizeMode="cover" />
    </View>
  );
}

const { background, white, black } = herofitTheme.colors.base;
const styles = StyleSheet.create({
  container: {
    margin: 8,
    marginTop: 0,
    borderRadius: 5,
    borderWidth: 1,
    borderRightColor: white,
    borderTopColor: white,
    borderBottomColor: background,
    borderLeftColor: background,
    overflow: "hidden",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  dropShadow: {
    shadowColor: black,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    justifyContent: "center",
    width: "107%",
    height: "107%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 0,
    backgroundColor: background,
    overflow: "hidden",
  },
  fullWidth: {
    margin: 0,
    borderRadius: 0,
    borderWidth: 0,
  },
});
