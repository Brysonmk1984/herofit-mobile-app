import React from "react";
import { HStack, Spinner, Text } from "native-base";

interface LoadingInPaneProps {
  size?: number | "lg" | "small" | "sm" | "large";
  color?: string;
  text?: string;
}

const LoadingInPane: React.FC<LoadingInPaneProps> = ({ size = "lg", color = "base.info", text }) => {
  return (
    <HStack justifyContent="center">
      <Spinner size={size} color={color} />
      {text && (
        <Text color="base.info" ml={3}>
          {text}
        </Text>
      )}
    </HStack>
  );
};

export default LoadingInPane;
