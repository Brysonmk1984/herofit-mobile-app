import React from 'react';
import { Center, Heading, Text, Divider } from 'native-base';

interface Subheader {
  text : string
  mb? : number,
  mt? : number,
  color? : string
}

export default function Subheader({ text, mt= 3, mb = 3, color } : Subheader){
  return(
    <Center mt={mt} mb={mb}>
      <Heading >
        <Text color={color} fontFamily='heading' fontSize="3xl">
          { text }
        </Text>
      </Heading>
      <Divider variant='subheaderDivider' />
    </Center>   
  )
}