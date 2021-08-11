import React, { useContext } from 'react';
import { Image, Pressable, FlatList, SectionList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, Icon, IconButton, HStack, Divider } from 'native-base';
import { GlobalStateContext } from '../../store';
import ScreenContainer from '../../Components/ScreenContainer';
import { lowercaseUnderscore } from '../../common/helperFunctions';
import { Hero } from '../../common/types';
import CustomImage from '../../Components/CustomImage';
import { getHeroImage } from '../../common/helperFunctions';

// Select Hero Screen
const SelectHero = ({ route, navigation }) =>{
  const { state, dispatch } = useContext(GlobalStateContext);
  const { heroList } = route.params;

  const Item = ({ hero }) => (
    <View >
      <Button title={hero.alias} onPress={() => navigation.push("HeroDetails", { hero })} />
    </View>
  );

  const renderItem = ({ item : hero, index }) => {
    const lcName = lowercaseUnderscore(hero.character);

    console.log('ITEM', hero, lcName,);
    return <Box px={5} py={2} height={100} bg={`base.${lcName}`}>
      <Pressable  onPress={() => navigation.push("HeroDetails", { hero })}>
        <View>
          <HStack>

            {
              index % 2 ? 
              <>
                <Box height={10}>
                <Image 
                source={getHeroImage(hero.character)} 
                size={'xl'}
                alt={hero.alias} />
              </Box>
              <View pl={5} flex={2}>
                <Text fontFamily="heading" fontSize="2xl">{ hero.alias }</Text>
                <Text color='primary.500'>{ hero.description }</Text>
              </View>
              </>
            :
            <>
              <View pl={5} flex={2}>
                <Text fontFamily="heading" fontSize="2xl">{ hero.alias }</Text>
                <Text color='primary.500'>{ hero.description }</Text>
              </View>
              <Box height={10}>
                <Image 
                source={getHeroImage(hero.character)} 
                size={'xl'}
                alt={hero.alias} />
              </Box>
            </>
            }
            
          </HStack>
        </View>
      </Pressable>
    </Box>
  };




  /// map out each hero in list on screen
  return (
    <ScreenContainer fullView={true}>
      <VStack flex={3}>
        <FlatList
          data={heroList}
          renderItem={renderItem}
          keyExtractor={(item, i) => i.toString()}
        />
      </VStack>
    </ScreenContainer>
  )
}

export default SelectHero;