import React from "react";
import { View, Text, ScrollView } from "native-base";
import { Dimensions } from "react-native";

interface BodyContentProps {
  children: React.ReactChild | React.ReactChild[];
}

const BodyContent: React.FC<BodyContentProps> = ({ children }) => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  const isLongPhone = deviceHeight > deviceWidth * 1.8;
  const isMedPhone = deviceHeight > deviceWidth * 1.7;
  return <View maxHeight={isLongPhone ? "64%" : isMedPhone ? "54%" : "45%"}>{children}</View>;
};

export default BodyContent;
