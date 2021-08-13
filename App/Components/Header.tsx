import React from 'react'
import { Center, Heading, Text } from 'native-base';

interface HeaderProps {
  text : string
}

export const Header: React.FC<HeaderProps> = ({ text }) => {
  return(
    <Center mt={5} mb={8}>
      <Heading ><Text fontFamily='heading' fontSize="5xl">{ text }</Text></Heading>
    </Center>   
  )
}

export default Header;