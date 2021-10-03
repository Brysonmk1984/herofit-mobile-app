import React from "react";
import { Box, Pressable, Text } from "native-base";

interface PressableInputProps {
  action: () => void;
  value: number | string | null | undefined;
  placeholder?: string;
  flex?: number;
  width?: number | string;
  ml?: number;
  mr?: number;
  alignItems?: string;
}

const PressableInput: React.FC<PressableInputProps> = ({ action, value, placeholder, flex, width, ml, mr, alignItems }) => {
  function renderValue(value) {
    if (typeof value === "null" || typeof value === "undefined") {
      return;
    }
    return <Text>{value}</Text>;
  }

  function renderPlaceholder(placeholder) {
    return <Text color="primary.500">{placeholder}</Text>;
  }

  return (
    <Pressable flex={flex} w={width} ml={ml} mr={mr} onPress={action}>
      <Box alignItems={alignItems} bgColor="base.white" borderColor="primary.500" borderWidth={1} borderRadius={12} pb={4} pt={3} px={3}>
        {renderValue(value) ?? renderPlaceholder(placeholder)}
      </Box>
    </Pressable>
  );
};

export default PressableInput;
