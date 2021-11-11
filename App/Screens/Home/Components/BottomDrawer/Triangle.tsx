import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Button, Text, View } from "native-base";

const Triangle = ({ action }) => {
  return (
    <View style={[styles.triangle, styles.triangleBorder]}>
      <Pressable
        style={({ pressed }) => [
          styles.triangle,
          {
            borderBottomColor: pressed ? "#86efac" : "#242423",
            marginLeft: -44,
            marginTop: 2,
          },
        ]}
        alignItems="center"
        onPress={() => action()}
      >
        <View mt={6} style={[styles.triangle, styles.smallTriangle]}></View>
      </Pressable>
    </View>
  );
};

export default Triangle;

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 44,
    borderRightWidth: 44,
    borderBottomWidth: 66,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  smallTriangle: {
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 30,
    borderBottomColor: "#356735",
  },
  triangleBorder: {
    borderLeftWidth: 44,
    borderRightWidth: 44,
    borderBottomWidth: 66,
    borderBottomColor: "#d4af37",
  },
});
