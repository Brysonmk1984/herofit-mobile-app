import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, ImageBackground } from "react-native";

interface BackgroundProps {}

const Background: React.FC<BackgroundProps> = ({}) => {
  const backgroundDawn: [string, string] = ["#ffbf61", "#fee3ba"];
  const backgroundDay: [string, string] = ["#47b9e6", "#e8f8ff"];
  const backgroundDusk: [string, string] = ["#4e5481", "#fd5e53"];
  const backgroundNight: [string, string] = ["#061928", "#164d78"];
  const backgroundElementalEvent = require("../../../../../assets/images/backgrounds/home/elemental-background.webp");

  const backgrounds = [backgroundDawn, backgroundDay, backgroundDusk, backgroundNight, backgroundElementalEvent];
  //const activeBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const activeBackground = backgrounds[4];

  if (typeof activeBackground === "number") {
    // Images imported with the required method are numbers, so render them here
    return <ImageBackground source={activeBackground} style={styles.image} resizeMode="cover" />;
  } else {
    // Otherwise, render the gradient
    return <LinearGradient colors={activeBackground} style={styles.background} />;
  }
};

export default Background;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  image: {
    justifyContent: "center",
    width: "107%",
    height: "107%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 0,
    elevation: 0,
    overflow: "hidden",
  },
});
