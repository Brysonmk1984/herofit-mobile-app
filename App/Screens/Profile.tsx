import React, { useContext } from 'react';
import { Image, Pressable, FlatList, SectionList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from 'native-base';
import ScreenContainer from '../Components/ScreenContainer/ScreenContainer';
import { Store, User } from '../common/types';
import { GlobalStateContext } from '../store';

interface ProfileProps {

}

const Profile: React.FC<ProfileProps> = ({ navigation, route }) => {
  const { state, dispatch } = useContext<Store>(GlobalStateContext);
  const { hero } = state;

  return (
    <ScreenContainer>
      <Text>Profile Page</Text>
    </ScreenContainer>
  );
}

export default Profile;