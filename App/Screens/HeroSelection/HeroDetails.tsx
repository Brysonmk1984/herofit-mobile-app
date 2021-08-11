import React, { useEffect } from 'react';
import { Image, Pressable, FlatList, SectionList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, useToken } from 'native-base';
import ScreenContainer from '../../Components/ScreenContainer';
import Icon from '../../Components/Icons';
import { getHeroImage } from '../../common/helperFunctions';

// Hero Details Screen
const HeroDetails = ({ route, navigation }) => {
  const { hero } = route.params;
  
  // accessing theme colors
  const [fire, earth, water, air] = useToken(
    // the key within the theme, in this case `theme.colors`
    "colors",
    // the subkey(s), resolving to `theme.colors.warning.1`
    ["base.fire", "base.earth", "base.water", "base.air"]
  );

  useEffect(() =>{
    navigation.setOptions({ title: hero.alias });
  }, []);

  return (
    <ScreenContainer>
      <Box>
        <Image 
          source={getHeroImage(hero.character)} 
          size={'xl'}
          alt={hero.alias} 
        />
      </Box>
      <VStack>
        <HStack>
          <HStack>
            <VStack>
              <Icon iconName="fire" size={50} color={fire} />
              <Text color='base.fire'>
                FIRE
              </Text>
            </VStack>
            <Text>
              {hero.fire}
            </Text>
          </HStack>
          <HStack>
            <VStack>
              <Icon iconName="earth" size={50} color={earth} />
              <Text>
                Earth
              </Text>
            </VStack>
            <Text>
              {hero.earth}
            </Text>
          </HStack>
          <HStack>
            <VStack>
              <Icon iconName="water" size={50} color={water} />
              <Text>
                Water
              </Text>
            </VStack>
            <Text>
              {hero.water}
            </Text>
          </HStack>
          <HStack>
            <VStack>
              <Icon iconName="air" size={50} color={air} />
              <Text>
                Air
              </Text>
            </VStack>
            <Text>
              {hero.air}
            </Text>
          </HStack>
        </HStack>
        <Text>{ hero.history }</Text>
        <Button onPress={() => navigation.navigate('FinalizeHeroSelection', { hero })}>
          Select
        </Button>
      </VStack>
    </ScreenContainer>
  )
}

export default HeroDetails;