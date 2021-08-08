import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import ScreenContainer from '../Components/ScreenContainer';
import { Store, User } from '../common/types';
import { GlobalStateContext } from '../store';

interface ItemsProps {

}

const Items: React.FC<ItemsProps> = ({ navigation }) => {
  const { state, dispatch } = useContext<Store>(GlobalStateContext);
  const { hero } = state;

  return (
    <ScreenContainer>
      <Text>Items Page</Text>
    </ScreenContainer>
  );
}

export default Items;