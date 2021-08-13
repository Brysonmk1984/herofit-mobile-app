import React from 'react';
import { Center, Text, useTheme } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

interface HelperTextProps {
  text : string
}

const HelperText: React.FC<HelperTextProps> = ({ text }) => {
  const { colors } = useTheme();

  return (
    <Center flexDirection="row">
      <Ionicons name="warning-outline" size={32} color={colors.base.warning} />
      <Text ml={5} color="base.warning">{text}</Text>
    </Center>
  );
}

export default HelperText;