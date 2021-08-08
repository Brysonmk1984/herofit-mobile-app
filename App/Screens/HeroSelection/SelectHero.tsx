import React, { useContext } from 'react';
import { Image, Pressable, FlatList, SectionList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, Icon, IconButton, HStack, Divider } from 'native-base';
import { GlobalStateContext } from '../../store';
import ScreenContainer from '../../Components/ScreenContainer';
import { lowercaseUnderscore } from '../../common/helperFunctions';
import { Hero } from '../../common/types';
import CustomImage from '../../Components/CustomImage';
// Select Hero Screen
const SelectHero = ({ route, navigation }) =>{
  const { state, dispatch } = useContext(GlobalStateContext);
  const { heroList } = route.params;

  const Item = ({ hero }) => (
    <View >
      <Button title={hero.alias} onPress={() => navigation.push("HeroDetails", { hero })} />
    </View>
  );


  function getHeroImage(characterName) {
    const lcName = lowercaseUnderscore(characterName);
    switch (lcName) {
      case "timber_terror":
        return require('../../../assets/images/heroes/timber_terror/timber_terror.webp');
      case "repete":
        return require('../../../assets/images/heroes/repete/repete.webp');
      case "filtron_five":
        return require('../../../assets/images/heroes/filtron_five/filtron_five.webp');
      case "chrono_guy":
        return require('../../../assets/images/heroes/chrono_guy/chrono_guy.webp');
      case "solar_celeste":
        return require('../../../assets/images/heroes/solar_celeste/solar_celeste.webp');
      case "wilhelm_the_wild":
        return require('../../../assets/images/heroes/wilhelm_the_wild/wilhelm_the_wild.webp');
      case "natural_ninja":
          return require('../../../assets/images/heroes/natural_ninja/natural_ninja.webp');
      case "empath_aurelia":
          return require('../../../assets/images/heroes/empath_aurelia/empath_aurelia.webp');
      case "boulder_bro":
          return require('../../../assets/images/heroes/boulder_bro/boulder_bro.webp');
      case "compost_creature":
          return require('../../../assets/images/heroes/compost_creature/compost_creature.webp');
      default:
        throw new Error('No matching image');
    }
  }


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