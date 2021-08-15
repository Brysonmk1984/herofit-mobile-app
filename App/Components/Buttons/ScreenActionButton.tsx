import React from 'react'
import { View, Button } from 'native-base';

interface ScreenActionProps {
  name : string
  disabled : boolean
  action : () => void
}

const ScreenActionButton: React.FC<ScreenActionProps> = ({ name, disabled, action }) => {
  return (
    <View mx={50} mb={5}>
      <Button disabled={disabled} onPress={action}>
        { name }
      </Button>
    </View>
  );
};

export default ScreenActionButton;