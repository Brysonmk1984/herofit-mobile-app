import React, { useContext, useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, ImageBackground, Animated, View } from "react-native";
import { GlobalStateContext } from "../../../store";
import { opacity } from "styled-system";

const bg = {
  backgroundDawn: ["#ffbf61", "#fee3ba"],
  backgroundDay: ["#47b9e6", "#e8f8ff"],
  backgroundDusk: ["#4e5481", "#fd5e53"],
  backgroundNight: ["#061928", "#164d78"],
  backgroundElementalEvent: require("../../../../assets/images/backgrounds/home/elemental-background.webp"),
};

interface BackgroundProps {
  animation?: string;
  setBackgroundAnimation?: (val: null) => void;
}

const Background: React.FC<BackgroundProps> = ({ animation, setBackgroundAnimation }) => {
  const [animationBackground, setAnimationBackground] = useState(null);
  const { state, dispatch } = useContext(GlobalStateContext);

  function determineBackgroundAnimation(name: string) {
    if (name === "activity-up") {
      return require("../../../../assets/images/gifs/activity-up.gif");
    } else if ("level-up") {
      return require("../../../../assets/images/gifs/level-up.gif");
    }
  }

  function handleBackgroundSelection(sessionBackground: string) {
    if (typeof bg[sessionBackground] === "number") {
      // Images imported with the required method are numbers, so render them here
      return (
        <View style={[styles.imageContainer, { height: "100%", width: "100%", justifyContent: "flex-start" }]}>
          <ImageBackground source={bg[sessionBackground]} style={{ height: "90%" }} resizeMode="cover" />
        </View>
      );
    } else if (Array.isArray(bg[sessionBackground])) {
      // Otherwise, render the gradient
      return (
        <View style={[styles.background, { height: "100%", width: "100%", justifyContent: "flex-start" }]}>
          <LinearGradient colors={bg[sessionBackground]} style={{ height: "90%", width: "100%" }} />
        </View>
      );
    } else {
      throw new Error("Homescreen background Type must be a string or an array!");
    }
  }

  // Fading in and out of animated backgrounds
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = (animation: string, cb: () => void) => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: animation === "level-up" ? 1000 : 500,
      useNativeDriver: true,
    }).start(() => cb());
  };
  const fadeOut = () => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: animation === "activity-up" ? 1000 : 500,
      useNativeDriver: true,
    }).start(() => {
      setAnimationBackground(null);
      setBackgroundAnimation(null);
    });
  };

  // Trigger updating animated background state locally if animation (string) is passed in
  useEffect(() => {
    if (animation) {
      setAnimationBackground(determineBackgroundAnimation(animation));
      fadeIn(animation, fadeOut);
    }
  }, [animation]);

  // On Initial load, check if there is a background in the store, if not, set it
  useEffect(() => {
    if (!state.background) {
      // Random background selection from the object at the top of the page
      const backgroundKeys = Object.keys(bg);
      const backgroundName = backgroundKeys[Math.floor(Math.random() * backgroundKeys.length)];

      dispatch({ type: "SET BACKGROUND", payload: { background: backgroundName } });
    }
  }, []);

  return (
    <>
      {state.background ? handleBackgroundSelection(state.background) : <View style={styles.imageContainer}></View>}
      {animationBackground && (
        <Animated.View style={[styles.imageContainer, { opacity: opacityAnim, backgroundColor: "rgba(0,0,0,.4)" }]}>
          <ImageBackground source={animationBackground} style={[styles.image, { backgroundColor: undefined }]} resizeMode="cover" />
        </Animated.View>
      )}
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
    backgroundColor: "#2b2b2a",
  },
  imageContainer: {
    justifyContent: "center",
    width: "100%",
    height: "90%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 0,
    elevation: 0,
    overflow: "hidden",
    backgroundColor: "#2b2b2a",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
