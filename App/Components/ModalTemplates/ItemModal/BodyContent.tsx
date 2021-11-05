import React from "react";
import { View, Text, ScrollView } from "native-base";
import { Dimensions } from "react-native";

interface BodyContentProps {
  children: React.ReactChild | React.ReactChild[];
}

const BodyContent: React.FC<BodyContentProps> = ({ children }) => {
  return (
    <View flex={1} flexGrow={100}>
      {children}
    </View>
  );
};

export default BodyContent;
