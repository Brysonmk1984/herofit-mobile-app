import { Box, HStack, Text } from "native-base";
import React from "react";
import Icon from "../../Components/Icon";

interface SwipeForNextScreenProps {
  reversedText?: boolean;
}

const SwipeForNextScreen: React.FC<SwipeForNextScreenProps> = ({ reversedText }) => {
  return (
    <Box position="absolute" bottom={1} left="50%" ml={-55} mt={5}>
      <HStack>
        <Text color={reversedText ? "base.brand" : "base.primary"}>Next Screen</Text>
        <Box
          ml={2}
          mt={-1.5}
          style={{
            transform: [{ rotateX: "-45deg" }, { rotateZ: "-45deg" }],
          }}
        >
          <Icon iconName="bottom-right-3d-arrow" size={36} color={reversedText ? "base.brand" : "base.primary"} />
        </Box>
      </HStack>
    </Box>
  );
};

export default SwipeForNextScreen;
