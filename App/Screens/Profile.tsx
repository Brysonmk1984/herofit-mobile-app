import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import ScreenContainer from '../Components/ScreenContainer';
import { IStore, IUser } from '../common/interfaces';
import { store } from '../store';

interface ProfileProps {

}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const { state, dispatch } = useContext<IStore>(store);
  const { hero } = state;

  return (
    <ScreenContainer>
      <Text>Profile Page</Text>
    </ScreenContainer>
  );
}

export default Profile;