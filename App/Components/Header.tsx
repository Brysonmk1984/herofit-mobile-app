import React from 'react';
import { StyleSheet } from 'react-native';
import { Center, Heading, Text } from 'native-base';

interface HeaderProps {
  text : string
  mb? : number
  color? : string
}

export const Header: React.FC<HeaderProps> = ({ text, mb = 5, color }) => {
  return(
    <Center mt={3} mb={mb}>
      <Heading >
        <Text color={color} style={Styles.textShadow} fontFamily='heading' fontSize="5xl">
          { text }
        </Text>
      </Heading>
    </Center>   
  )
}

export default Header;

const Styles = StyleSheet.create({
  textShadow : {
    textShadowColor: 'rgba(36, 36, 35, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 3
  }
});