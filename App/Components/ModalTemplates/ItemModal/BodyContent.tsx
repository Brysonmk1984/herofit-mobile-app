import React, { useMemo } from "react";
import { View, Text, ScrollView } from "native-base";
import { Dimensions } from "react-native";
import useAspectRatio from "../../../common/hooks/useAspectRatio";

interface BodyContentProps {
  children: React.ReactChild | React.ReactChild[];
}

const BodyContent: React.FC<BodyContentProps> = ({ children }) => {
  const { deviceAspectType } = useMemo(() => useAspectRatio(), []);
  const isLongPhone = deviceAspectType === "long";
  const isMediumPhone = deviceAspectType === "medium";

  return <View maxHeight={isLongPhone ? "64%" : isMediumPhone ? "54%" : "45%"}>{children}</View>;
};

export default BodyContent;
