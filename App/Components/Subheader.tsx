import React from 'react';
import { Center, Heading, Text, Divider } from 'native-base';

interface Subheader {
  text : string
  mb? : number
}

export default function Subheader({ text, mb = 3 } : Subheader){
  return(
    <Center mt={3} mb={mb}>
      <Heading >
        <Text fontFamily='heading' fontSize="3xl">
          { text }
        </Text>
      </Heading>
      <Divider variant='subheaderDivider' />
    </Center>   
  )
}