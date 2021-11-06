import React from "react";
import { Center, Text, useTheme } from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ActionFeedbackType } from "../common/types";

function renderIcon(type, colors) {
  switch (type) {
    case "success":
      return <Ionicons name="md-checkmark-circle" size={32} color={colors.base.success} />;
    case "caution":
      return <Ionicons name="md-warning-sharp" size={32} color={colors.base.caution} />;
    case "error":
      return <MaterialIcons name="error" size={32} color={colors.base.error} />;
    case "info":
      return <MaterialIcons name="info" size={32} color={colors.base.info} />;
    default:
      return null;
  }
}

interface HelperTextProps {
  text: string;
  type?: ActionFeedbackType;
  fontSize?: "sm" | "md" | "lg" | "xl";
}

const HelperText: React.FC<HelperTextProps> = ({ text, type, fontSize = "md" }) => {
  const { colors } = useTheme();

  return (
    <Center flexDirection="row" mt={2}>
      {renderIcon(type, colors)}
      <Text flexWrap="wrap" fontSize={fontSize} ml={5} color={colors.base[type]}>
        {text}
      </Text>
    </Center>
  );
};

export default HelperText;
