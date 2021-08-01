import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ScreenContainerProps {
  children : React.ReactNode
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({ children } : { children : React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>;
}

export default ScreenContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
