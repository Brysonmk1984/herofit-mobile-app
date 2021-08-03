import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import ScreenContainer from '../Components/ScreenContainer';
import { Store, User } from '../common/types';
import { store } from '../store';

interface InventoryProps {

}

const Inventory: React.FC<InventoryProps> = ({ navigation }) => {
  const { state, dispatch } = useContext<Store>(store);
  const { hero } = state;

  return (
    <ScreenContainer>
      <Text>Inventory Page</Text>
    </ScreenContainer>
  );
}

export default Inventory;