import React from 'react';
import { Flex, View } from 'native-base';

interface ScreenContainerProps {
  children : React.ReactNode,
}

export default function({ children } : ScreenContainerProps) {
  return (
    <Flex safeArea flex={1}  justify="space-between"  bg="base.background" p={0} w={"100%"} mx='auto' >
      {children}
    </Flex>
  )
};