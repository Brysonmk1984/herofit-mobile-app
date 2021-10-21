import React from "react";
import { View, Text, ScrollView } from "native-base";
import { Icon } from "../../CustomComponents";

// TODO: switch this to use typescript 4.1 Mapped types for case insensitivity
export interface IActionHeader {
  type: "Info" | "Warning" | "Error" | "Success" | "info" | "warning" | "error" | "success";
  text: string;
}

interface ActionHeaderProps extends IActionHeader {}

export const ActionHeader: React.FC<ActionHeaderProps> = actionHeader => {
  return (
    <View flexWrap="wrap" justifyContent="center" flexDirection="row" bgColor={`${actionHeader.type.toLowerCase()}.500`} py={2}>
      <Text mr={2}>
        <Icon iconName={actionHeader.type} color="white" size={6} />
      </Text>
      <Text color="white" textAlign="center" fontSize={actionHeader.text.length > 38 ? "lg" : "2xl"} fontFamily="heading">
        {actionHeader.text}
      </Text>
    </View>
  );
};

interface BodyContentProps {
  children: React.ReactChild | React.ReactChild[];
}

export const BodyContent: React.FC<BodyContentProps> = ({ children }) => {
  return <ScrollView padding={3}>{children}</ScrollView>;
};
