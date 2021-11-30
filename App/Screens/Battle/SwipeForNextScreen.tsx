import { Box, HStack, Text } from "native-base";
import React from "react";
import Icon from "../../Components/Icon";

interface SwipeForNextScreenProps {
  position?: "relative" | "absolute";
  center?: boolean;
}

const SwipeForNextScreen: React.FC<SwipeForNextScreenProps> = ({ position = "relative", center }) => {
  const left = center ? 24 : 2;
  return (
    <Box position={position} bottom={1} left={left} mt={5}>
      <HStack>
        <Text>Swipe for Next Screen</Text>
        <Box
          ml={6}
          mt={-1.5}
          style={{
            transform: [{ rotateX: "-45deg" }, { rotateZ: "-45deg" }],
          }}
        >
          <Icon iconName="bottom-right-3d-arrow" size={36} />
        </Box>
      </HStack>
    </Box>
  );
};

export default SwipeForNextScreen;
