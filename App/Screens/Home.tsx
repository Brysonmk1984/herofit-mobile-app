import React, { useContext, useEffect, useState, createRef } from 'react';
import { Image, Pressable, FlatList, SectionList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from 'native-base';
import ScreenContainer from '../Components/ScreenContainer/ScreenContainer';
import debugErrors from '../common/debugErrors';
import { GlobalStateContext } from '../store';
import { Item } from '../common/types';
import { MainDrawerProps } from '../common/types-navigator';


const Home : React.FC<MainDrawerProps<'Home'>> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  console.log('!HERO`', state.hero);
  const { name, status, health, maxHealth, activityXP, battleXP, photonTokens, goToBattle, equipped } = state.hero;
  console.log('equiped array', equipped);
  function renderItem({ item } : Item ){
    console.log("ITEM!", item);
    return <View>
      <Text>{ item.name }</Text>
    </View>
  }

  function renderHeroDetails(){

    return <View>
      <Text>Hero Name: {name}</Text>
      <Text>Status: {status}</Text>
      <Text>Health: {health} / {maxHealth}</Text>
      <Text>XP: {activityXP + battleXP}</Text>
      <Text>PT: {photonTokens}</Text>
      <Text>Awaiting Battle: { String(goToBattle) }</Text>
      <FlatList
        data={equipped}
        renderItem={renderItem}
        keyExtractor={(item, i) => i.toString()}
      />
    </View>
  }



  useEffect(() =>{
    if(!state.isSignedIn){
      return navigation.navigate('Auth', { screen: 'HomeWrapperScreen', params: { screen : 'Home'} });
    }
  }, [state.isSignedIn]);

  return (
    <ScreenContainer screenName={route.name}>
      { renderHeroDetails() }
      <Button onPress={() => navigation.toggleDrawer()}>
        Drawer
      </Button>
    </ScreenContainer>
  )
};

export default Home;