import React, { ReactNode } from 'react';
import { Box, View } from 'native-base';

interface ScreenContainerProps {
  children : ReactNode,
  fullView? : boolean
}

export default function({ children, fullView } : ScreenContainerProps) {
  return (
    <Box safeArea flex={1}  bg="base.background" >
      <View p={fullView ? 0 : 2} w={fullView ? "100%" : "90%"} mx='auto'>
        {children}
      </View>

    </Box>
  )
};