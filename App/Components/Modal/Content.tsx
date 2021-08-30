import React from "react";
import { View, Text, ScrollView } from "native-base";
import { Icon } from "../CustomComponents";

export interface IActionHeader {
  type: "Info" | "Warning" | "Error" | "Success";
  text: string;
}

interface ActionHeaderProps extends IActionHeader {}

export const ActionHeader: React.FC<ActionHeaderProps> = actionHeader => {
  return (
    <View justifyContent="center" flexDirection="row" backgroundColor={`${actionHeader.type.toLowerCase()}.500`} py={2}>
      <Text mr={2}>
        <Icon iconName={actionHeader.type} color="white" size={8} />
      </Text>
      <Text color="white" textAlign="center" fontSize="3xl" fontFamily="heading">
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
