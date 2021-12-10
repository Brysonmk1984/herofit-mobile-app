import React, { useRef } from "react";

import { Pressable, Button, View, useToast, Text, Box, HStack } from "native-base";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import toastTheme from "../../styles/toastTheme";
import { ActionFeedbackType } from "../types";
import useAspectRatio from "./useAspectRatio";
import Toast from "react-native-toast-message";

const useGlobalToast = () => {
  const toast = useToast();
  const toastIdRef = useRef();
  const { deviceAspectType, deviceHeight } = useAspectRatio();
  const toastPosition = deviceAspectType === "long" ? deviceHeight * 0.12 : deviceAspectType === "medium" ? deviceHeight * 0.1 : deviceHeight * 0.12;

  function close() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  function _renderIcon(type: ActionFeedbackType, style: { color: string }) {
    switch (type) {
      case "success":
        return <Ionicons name="md-checkmark-circle" size={24} color={style.color} />;
      case "caution":
        return <Ionicons name="md-warning-sharp" size={24} color={style.color} />;
      case "error":
        return <MaterialIcons name="error" size={24} color={style.color} />;
      case "info":
        return <MaterialIcons name="info" size={24} color={style.color} />;
      default:
        return null;
    }
  }

  return {
    addToast: (type: ActionFeedbackType, message: string, duration = 2200, offset: number | string = "default") => {
      const bottomOffset = offset === "default" ? 25 : (offset as number);
      return Toast.show({
        type,
        text1: type.toUpperCase(),
        text2: message,
        visibilityTime: duration,
        bottomOffset,
      });
    },
  };
};

export default useGlobalToast;
