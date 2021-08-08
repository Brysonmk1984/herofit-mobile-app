import React, { useEffect } from 'react';
import { Image, Pressable, FlatList, SectionList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from 'native-base';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import ScreenContainer from '../../Components/ScreenContainer';
import CustomIconExample from '../../Components/IcoMoon';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import Icon from '../../Components/Icons';
import { themeObject } from '../../Components/ScreenContainer';

// Hero Details Screen
const HeroDetails = ({ route, navigation }) => {
  const { hero } = route.params;

  useEffect(() =>{
    navigation.setOptions({ title: hero.alias });
  }, []);

  return (
    <ScreenContainer>
      <VStack>
        <Icon iconName="critical-strike" size={50} color="orange" />
        
        <Icon iconName="antidote-potion" size={50} color="red" />
        <Text>
          <Icon iconName="fire" size={50} color={themeObject.colors.base.fire} />FIRE:{hero.fire}
        </Text>
        <Text>
          <Icon iconName="earth" size={50} color="base.earth" />EARTH: {hero.earth}
        </Text>
        <Text>
          <Icon iconName="water" size={50} color="base.water" />WATER:{hero.water}
        </Text>
        <Text>
          <Icon iconName="air" size={50} color="base.air" />AIR:{hero.air}
        </Text>
        <Text>{ hero.history }</Text>
        <Button onPress={() => navigation.navigate('FinalizeHeroSelection', { hero })}>
          Select
        </Button>
      </VStack>
    </ScreenContainer>
  )
}

export default HeroDetails;