import React, { useState, useEffect, useRef } from "react";
import { Dimensions, Animated } from "react-native";

const useFloating = (float: boolean) => {
  const [floating, setFloating] = useState(float);
  const deviceHeight = Dimensions.get("window").height;
  let floatAnimation = useRef(new Animated.Value(deviceHeight)).current;

  function floatDown() {
    if (floating) {
      Animated.timing(floatAnimation, {
        toValue: deviceHeight - 300,
        duration: 2500,
        useNativeDriver: true,
      }).start(floatUp);
    }
  }

  function floatUp() {
    if (floating) {
      Animated.timing(floatAnimation, {
        toValue: deviceHeight - 350,
        duration: 2500,
        useNativeDriver: true,
      }).start(floatDown);
    }
  }

  useEffect(() => {
    if (floating) {
      Animated.timing(floatAnimation, {
        toValue: deviceHeight - 400,
        duration: 1500,
        useNativeDriver: true,
      }).start(floatDown);
    }
  }, [floating]);

  return { floating, setFloating, floatAnimation };
};

export default useFloating;
