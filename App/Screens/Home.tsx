import React, { useContext, useEffect, useState, createRef } from 'react';
import { View, Text, StyleSheet, Button, FlatList, SectionList } from 'react-native';
import ScreenContainer from '../Components/ScreenContainer';
import debugErrors from '../common/debugErrors';
import { store } from '../store';
import { Store, Item } from '../common/types';
interface HomeProps {

}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { state, dispatch } = useContext<Store>(store);
  console.log('!HERO`', state.hero);
  const { name, status, health, maxHealth, activityXP, battleXP, photonTokens, goToBattle, equipped } = state.hero;
  console.log('equiped array', equipped);
  function renderItem({ item } : { Item }){
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
    <ScreenContainer>
      { renderHeroDetails() }
      <Button title="Drawer" onPress={() => navigation.toggleDrawer()} />
    </ScreenContainer>
  )
};

export default Home;