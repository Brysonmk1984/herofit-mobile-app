import React, { useContext } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { store } from '../../store';
import ScreenContainer from '../../Components/ScreenContainer';

// Select Hero Screen
const SelectHero = ({ route, navigation }) =>{
  const { state, dispatch } = useContext(store);
  const { heroList } = route.params;

  const Item = ({ hero }) => (
    <View >
      <Button title={hero.alias} onPress={() => navigation.push("HeroDetails", { hero })} />
    </View>
  );

  const renderItem = ({ item }) => (
    <Item hero={item} />
  );


  /// map out each hero in list on screen
  return (
    <ScreenContainer>
      <Text>Select Hero Screen</Text>
      <Text>Choose from many heroes</Text>
      <FlatList
        data={heroList}
        renderItem={renderItem}
        keyExtractor={(item, i) => i.toString()}
      />
    </ScreenContainer>
  )
}

export default SelectHero;