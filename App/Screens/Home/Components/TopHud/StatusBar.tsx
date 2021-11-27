import { Box, View } from "native-base";
import React, { ReactChild } from "react";
import { StyleSheet } from "react-native";

interface StatusBarProps {
  children: ReactChild;
  windowWidth: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ children, windowWidth }) => {
  return (
    <View ml={-4} alignSelf="center" style={[styles.trapezoid, { width: windowWidth * 0.55 }]}>
      <Box mt={-9}>{children}</Box>
    </View>
  );
};

export default StatusBar;

const styles = StyleSheet.create({
  trapezoid: {
    height: 0,
    borderTopWidth: 36,
    borderTopColor: "#333633",
    borderLeftWidth: 22,
    borderLeftColor: "transparent",
    borderRightWidth: 22,
    borderRightColor: "transparent",
    borderStyle: "solid",
  },
});
