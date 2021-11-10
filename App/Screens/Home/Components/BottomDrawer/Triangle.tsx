import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Button, Text, View } from "native-base";

const Triangle = ({ action }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.triangle,
        {
          borderBottomColor: pressed ? "#86efac" : "#356735",
        },
      ]}
      alignItems="center"
      onPress={() => action()}
    >
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
  },
  smallTriangle: {
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 20,
    borderBottomColor: "#f1c85b",
  },
});
