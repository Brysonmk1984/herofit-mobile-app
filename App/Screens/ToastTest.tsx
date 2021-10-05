import { Button, View, useToast, Text, Toast } from "native-base";
import React from "react";

interface ToastTestProps {}

export const ToastTest: React.FC<ToastTestProps> = ({}) => {
  const toast = useToast();
  //toast.show({ description: "Hello world" });
  return (
    <View>
      <Button
        mt={50}
        onPress={() =>
          toast.show({
            text: "Wrong password!",
            position: "bottom",
            type: "warning",
          })
        }
      >
        <Text>Toast</Text>
      </Button>
      <Button
        onPress={() => {
          Toast.show({
            title: "Error!",
            description: "very wrong password",
            status: "warning",
          });
        }}
      >
        Toast Should extend full width
      </Button>
    </View>
  );
};
