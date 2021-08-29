import React from "react";
import { View, Button } from "native-base";

interface ScreenActionProps {
  text: string;
  disabled?: boolean;
  action: () => void;
}

const ScreenActionButton: React.FC<ScreenActionProps> = ({ text, disabled, action }) => {
  return (
    <View mx={50} my={3}>
      <Button disabled={disabled} onPress={action}>
        {text}
      </Button>
    </View>
  );
};

export default ScreenActionButton;
