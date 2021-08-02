import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import ScreenContainer from '../Components/ScreenContainer';
import { IStore, IUser } from '../common/interfaces';
import { store } from '../store';

interface CampaignProps {

}

const Campaign: React.FC<CampaignProps> = ({ navigation }) => {
  const { state, dispatch } = useContext<IStore>(store);
  const { hero } = state;

  return (
    <ScreenContainer>
      <Text>Campaign Page</Text>
    </ScreenContainer>
  );
}

export default Campaign;