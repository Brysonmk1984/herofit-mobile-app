import React, { useContext } from 'react';
import { Image, Pressable, FlatList, SectionList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from 'native-base';
import ScreenContainer from '../Components/ScreenContainer';
import { Store, User } from '../common/types';
import { GlobalStateContext } from '../store';

interface CampaignProps {

}

const Campaign: React.FC<CampaignProps> = ({ navigation }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { hero } = state;

  return (
    <ScreenContainer>
      <Text>Campaign Page</Text>
    </ScreenContainer>
  );
}

export default Campaign;