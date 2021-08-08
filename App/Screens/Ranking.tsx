import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import ScreenContainer from '../Components/ScreenContainer';
import { Store, User } from '../common/types';
import { GlobalStateContext } from '../store';

interface RankingProps {

}

const Ranking: React.FC<RankingProps> = ({ navigation }) => {
  const { state, dispatch } = useContext<Store>(GlobalStateContext);
  const { hero } = state;

  return (
    <ScreenContainer>
      <Text>Ranking Page</Text>
    </ScreenContainer>
  );
}

export default Ranking;