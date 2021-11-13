import React from "react";
import { Center, Spinner } from "native-base";
import LoadingInPane from "./LoadingInPane";

interface LoadingSpinnerProps {
  size?: number | "lg" | "small" | "sm" | "large";
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "lg", color = "base.size" }) => {
  return (
    <Center zIndex={1001} elevation={1001} position="absolute" left="50%" top="50%" ml={-5} mt={-5}>
      <Spinner size={size} color={color} />
    </Center>
  );
};

export default LoadingSpinner;
