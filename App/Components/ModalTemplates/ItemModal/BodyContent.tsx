import React from "react";
import { View, Text, ScrollView } from "native-base";
import { Dimensions } from "react-native";

interface BodyContentProps {
  children: React.ReactChild | React.ReactChild[];
}

const BodyContent: React.FC<BodyContentProps> = ({ children }) => {
  const { height, width } = Dimensions.get("window");
  const aspectRatio = height / width;
  const componentMaxHeight = aspectRatio > 1.85 ? height * 0.47 : aspectRatio > 1.7 ? height * 0.41 : height * 0.35;
  return (
    <ScrollView padding={3} maxHeight={componentMaxHeight}>
      {children}
    </ScrollView>
  );
};

export default BodyContent;
