import React, { ReactNode } from 'react';
import { Box } from 'native-base';

interface ScreenContainerProps {
  children : ReactNode,
  fullView? : boolean
}

export default function({ children, fullView } : ScreenContainerProps) {
  return (
    <Box safeArea flex={1} p={fullView ? 0 : 2} w={fullView ? "100%" : "90%"} mx='auto' >
      {children}
    </Box>
  )
};