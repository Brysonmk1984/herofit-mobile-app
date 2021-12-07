import React, { useRef } from "react";

import { Pressable, Button, View, useToast, Text, Toast, Box, HStack } from "native-base";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import toastTheme from "../../styles/toastTheme";
import { ActionFeedbackType } from "../types";
import { Dimensions } from "react-native";

const useGlobalToast = () => {
  const toast = useToast();
  const toastIdRef = useRef();

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

  function renderToast(type: ActionFeedbackType, message: string) {
    const aStyle = toastTheme[type];
    return (
      // Single Alert
      <View opacity={0.9} style={aStyle}>
        {/* Alert Header */}
        <HStack justifyContent="space-between">
          <Box flexDirection="row">
            {_renderIcon(type, aStyle)}
            <Text ml={2} mr={10} fontSize={20} lineHeight={24} color={aStyle.color}>
              {type === "info" ? "FYI" : type.toUpperCase()}
            </Text>
          </Box>
          <Pressable onPress={close}>
            <Ionicons name="md-close" size={24} color={`${aStyle.color}`} />
          </Pressable>
        </HStack>

        {/* Alert Body Text / Link / Button */}
        <Text style={{ color: aStyle.color }}>{message} </Text>
      </View>
    );
  }

  return {
    addToast: (type: ActionFeedbackType, message: string, placement: "top" | "bottom" = "bottom", duration = 2100) =>
      (toastIdRef.current = toast.show({
        render: () => renderToast(type, message),
        placement,
        duration,
      })),
  };
};

export default useGlobalToast;
