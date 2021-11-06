import React from "react";
import { View, Text } from "native-base";
import { ActionFeedbackType } from "../../common/types";
import Icon from "../Icon";

interface ModalActionHeaderProps {
  type: ActionFeedbackType;
  text: string;
}

export const ModalActionHeader: React.FC<ModalActionHeaderProps> = ({ type, text }) => {
  return (
    <View flexWrap="wrap" justifyContent="center" flexDirection="row" bgColor={`${type.toLowerCase()}.500`} py={2}>
      <Text mr={2} mt={1}>
        <Icon iconName={type} color="white" size={6} />
      </Text>
      <Text color="white" textAlign="center" fontSize={text.length > 40 ? "lg" : text.length > 32 ? "xl" : "2xl"} fontFamily="heading">
        {text}
      </Text>
    </View>
  );
};
