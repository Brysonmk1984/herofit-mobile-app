import React from "react";
import { ScrollView } from "native-base";

interface BodyContentProps {
  children: React.ReactChild | React.ReactChild[];
}

export const BodyContent: React.FC<BodyContentProps> = ({ children }) => {
  return <ScrollView padding={3}>{children}</ScrollView>;
};
