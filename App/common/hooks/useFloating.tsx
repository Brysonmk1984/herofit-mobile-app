import { useState, useEffect, useRef, useMemo } from "react";
import { Animated } from "react-native";
import useAspectRatio from "./useAspectRatio";

const useFloating = (float: boolean) => {
  const [floating, setFloating] = useState(float);
  const { deviceHeight } = useMemo(() => useAspectRatio(), []);
  const downHeight = deviceHeight * 1;
  const upHeight = deviceHeight * 1.1;
  let floatAnimation = useRef(new Animated.Value(deviceHeight)).current;

  function floatDown() {
    if (floating) {
      Animated.timing(floatAnimation, {
        toValue: deviceHeight - downHeight,
        duration: 2500,
        useNativeDriver: true,
      }).start(floatUp);
    }
  }

  function floatUp() {
    if (floating) {
      Animated.timing(floatAnimation, {
        toValue: deviceHeight - upHeight,
        duration: 2500,
        useNativeDriver: true,
      }).start(floatDown);
    }
  }

  useEffect(() => {
    if (floating) {
      Animated.timing(floatAnimation, {
        toValue: deviceHeight - (downHeight + 50),
        duration: 1500,
        useNativeDriver: true,
      }).start(floatDown);
    }
  }, [floating]);

  return { floating, setFloating, floatAnimation };
};

export default useFloating;
