import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { Image, Pressable, SectionList,FlatList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from 'native-base';
import HeroCarousel from '../../Components/HeroCarousel';
import { ScreenContainer, Header, Subheader, ScreenActionButton, Pane, Icon } from '../../Components/CustomComponents';

// Select Hero Screen
const SelectHero = ({ route, navigation }) =>{
  const { heroList } = route.params;
  const [activeHero, setActiveHero] = useState(heroList[0]);

  // HeroCarousel is absolutely positioned and sits on top of the normal ScreenContainer
  return (
    <Box w="100%" h="100%">
      <HeroCarousel heroList={heroList} setActiveHero={setActiveHero} viewDetails={(pressedHero) => navigation.push("HeroDetails", { selectedHero : pressedHero })} />
      <ScreenContainer screenName={route.name}>
        <Header mb={Dimensions.get('window').height * .4} text="Heroes" />
        <Pane>
          <View justifyContent="center"  >
            <Subheader mt={1} mb={0} text={activeHero.alias}  />
            <Text  textAlign="center" fontSize="xl">{ activeHero.description }</Text>
          </View>
        </Pane>
        <ScreenActionButton name="View Details" action={() => navigation.push("HeroDetails", { selectedHero : activeHero })}  />
      </ScreenContainer>
    </Box>
  )
}

export default SelectHero;