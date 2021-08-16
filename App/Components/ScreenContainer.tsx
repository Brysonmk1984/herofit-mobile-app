import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { Flex, View, Text } from 'native-base';
import { BlurView } from 'expo-blur';
interface ScreenContainerProps {
  children : React.ReactNode,
  screenName? : string
}

function determineImageBackground(page){
  switch(page){
    case 'SignIn':
      return require('../../assets/images/backgrounds/boulder-bro-background.webp')
    case 'Register':
      return require('../../assets/images/backgrounds/scorching-archfiend-background.webp')
    default:
      return require('../../assets/images/backgrounds/boulder-bro-background.webp')
  }
}


export default function ScreenContainer({ children, screenName } : ScreenContainerProps) {
  const image = determineImageBackground(screenName);
  return (
    <View style={[styles.container, styles.absolute, styles.dropShadow ]}>
      
      <Flex safeArea flex={1}  justify="space-between" zIndex={10}  p={0} w={"100%"} mx='auto' >
     
        {children}
      </Flex>

      <ImageBackground source={image}  style={styles.image} resizeMode="cover" />

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderRightColor: '#fff',
    borderTopColor: '#fff',
    borderBottomColor: '#E7EDDF',
    borderLeftColor: '#E7EDDF',
    overflow: 'hidden',
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  dropShadow:{
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    justifyContent: "center",
    width:'107%',
    height:'107%',
    position:'absolute',
    left: 0,
    top: 0,
    zIndex:0,
    backgroundColor: '#E7EDDF',
    overflow:'hidden'
  },
});