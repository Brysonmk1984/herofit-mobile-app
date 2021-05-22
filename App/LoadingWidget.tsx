import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingWrapperProps {

}

const LoadingWidget: React.FC<LoadingWrapperProps> = () => {

  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator style={styles.activityIndicator} size="large" color="#3792cb" />
    </View>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "stretch"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10
  },
  activityIndicator: {
    alignSelf: 'center',
    width:'100%',
    height:'100%'
  }
});

export default LoadingWidget;