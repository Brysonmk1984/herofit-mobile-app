import React from "react";
import { StyleSheet } from "react-native";
import { Pressable, Button, Text, View } from "native-base";

const Triangle = ({ action }) => {
  return (
    <Pressable alignItems="center" style={styles.triangle} onPress={() => action()}>
      <View mt={5} style={[styles.triangle, styles.smallTriangle]}></View>
    </Pressable>
  );
};

export default Triangle;

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 40,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#356735",
  },
  smallTriangle: {
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 20,
    borderBottomColor: "#f1c85b",
  },
});
