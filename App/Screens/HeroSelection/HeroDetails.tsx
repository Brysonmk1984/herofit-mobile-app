import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import ScreenContainer from '../../Components/ScreenContainer';

// Hero Details Screen
const HeroDetails = ({ route, navigation }) => {
  const { hero } = route.params;

  useEffect(() =>{
    navigation.setOptions({ title: hero.alias });
  }, []);

  return (
    <ScreenContainer>
      <View>
        <Text>FIRE: {hero.fire} EARTH: {hero.earth} WATER:{hero.water} AIR:{hero.air}</Text>
        <Text>{ hero.history }</Text>
        <Button title="Select" onPress={() => navigation.navigate('FinalizeHeroSelection', { hero })} />
      </View>
    </ScreenContainer>
  )
}

export default HeroDetails;