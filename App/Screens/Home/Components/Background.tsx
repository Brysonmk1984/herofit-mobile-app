import React, { useContext, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, ImageBackground } from "react-native";
import { GlobalStateContext } from "../../../store";

const bg = {
  backgroundDawn: ["#ffbf61", "#fee3ba"],
  backgroundDay: ["#47b9e6", "#e8f8ff"],
  backgroundDusk: ["#4e5481", "#fd5e53"],
  backgroundNight: ["#061928", "#164d78"],
  backgroundElementalEvent: require("../../../../assets/images/backgrounds/home/elemental-background.webp"),
};

interface BackgroundProps {
  animation?: string;
}

const Background: React.FC<BackgroundProps> = ({ animation }) => {
  const [animationBackground, setAnimationBackground] = useState(null);
  const { state, dispatch } = useContext(GlobalStateContext);

  function determineBackgroundAnimation(name: string) {
    if (name === "Level Up") {
      return require("../../../../assets/images/gifs/level-up.gif");
    }
  }

  function handleBackgroundSelection(sessionBackground: string) {
    if (typeof bg[sessionBackground] === "number") {
      // Images imported with the required method are numbers, so render them here
      return <ImageBackground source={bg[sessionBackground]} style={styles.image} resizeMode="cover" />;
    } else if (Array.isArray(bg[sessionBackground])) {
      // Otherwise, render the gradient
      return <LinearGradient colors={bg[sessionBackground]} style={styles.background} />;
    } else {
      throw new Error("Homescreen background Type must be a string or an array!");
    }
  }

  // Trigger updating animated background state locally if animation (string) is passed in
  useEffect(() => {
    if (animation) {
      setAnimationBackground(determineBackgroundAnimation(animation));

      const animationTimeout = setTimeout(() => {
        setAnimationBackground(null);
      }, 1200);

      return () => clearTimeout(animationTimeout);
    }
  }, [animation]);

  // On Initial load, check if there is a background in the store, if not, set it
  useEffect(() => {
    if (!state.background) {
      // Random background selection from the object at the top of the page
      const backgroundKeys = Object.keys(bg);
      const backgroundName = backgroundKeys[Math.floor(Math.random() * backgroundKeys.length)];
      console.log("!!!!", backgroundName);

      dispatch({ type: "SET BACKGROUND", payload: { background: backgroundName } });
    }
  }, []);

  return (
    <>
      {state.background && handleBackgroundSelection(state.background)}
      {animationBackground && <ImageBackground source={animationBackground} style={[styles.image, { backgroundColor: undefined }]} resizeMode="cover" />}
    </>
  );
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
