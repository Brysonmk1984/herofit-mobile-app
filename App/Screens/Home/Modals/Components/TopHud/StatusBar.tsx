import { Box, View } from "native-base";
import React, { ReactChild } from "react";
import { StyleSheet } from "react-native";

interface StatusBarProps {
  children: ReactChild;
  windowWidth: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ children, windowWidth }) => {
  return (
    <View ml={-12} alignSelf="center" style={[styles.trapezoid, { width: windowWidth * 0.5 }]}>
      <Box mt={-8}>{children}</Box>
    </View>
  );
};

export default StatusBar;

const styles = StyleSheet.create({
  trapezoid: {
    height: 0,
    borderTopWidth: 30,
    borderTopColor: "#242423",
    borderLeftWidth: 20,
    borderLeftColor: "transparent",
    borderRightWidth: 20,
    borderRightColor: "transparent",
    borderStyle: "solid",
  },
});
