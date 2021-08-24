import React, { useContext } from 'react';
import { Image, Pressable, FlatList, SectionList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from 'native-base';
import ScreenContainer from '../Components/ScreenContainer/ScreenContainer';
import { GlobalStateContext } from '../store';
import { MainDrawerProps } from '../common/types-navigator';



const Inventory: React.FC<MainDrawerProps<'Inventory'>> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { hero } = state;

  return (
    <ScreenContainer>
      <Text>Inventory Page</Text>
    </ScreenContainer>
  );
}

export default Inventory;