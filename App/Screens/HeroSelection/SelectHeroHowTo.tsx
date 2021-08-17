import React, { useEffect, useState } from 'react';
import {  FlatList, ScrollView,  Box, View, Text, VStack, HStack } from 'native-base';
import debugErrors from '../../common/debugErrors';
import { getHeroList } from '../../api/authentication';
import ScreenContainer from '../../Components/ScreenContainer';
import { Header, Subheader, ScreenActionButton, Pane, Icon } from '../../Components/CustomComponents';

// How To Select Screen
export default function SelectHeroHowTo({ navigation, route }){
  // Make API call to get hero data for the next screen
  const [heroList, setHeroList] = useState([]);

  useEffect(() =>{
    // Fetch list of Heroes from server so it's ready for the next screen
    getHeroList()
    .then((data) =>{
      setHeroList(data);
    }).catch((error) =>{
      return debugErrors(error);
    });
  }, []);


  return (
    <ScreenContainer screenName={route.name}>
      <ScrollView mb={5}>
        <Header mb={3} text="Just One Thing" />
        <VStack mb={3}>
          <Pane>
            <Text textAlign="justify" fontSize="xs">Heroes have slightly different starting stats. These values have only a small impact: ultimately your training and how you spend Quantum Points (Talent points) will dictate how your hero develops.</Text>
          </Pane>
          <Pane>
            <Subheader text="Base Stats" />
            <FlatList 
              data={[
                {
                  trait : "Power",
                  value : "100",
                  description : "Primary source of Damage. Your opponent’s Armor value will reduce damage done.",
                },
                {
                  trait : "Health",
                  value : "100",
                  description : "A Hero's life total. Physical & elemental reduces health in battle. If health drops to zero, the hero is 'Knocked Out'.",
                },
                {
                  trait : "Recovery",
                  value : "5",
                  description : "Boosts Health Recovered per hour & chance to revive early from being 'Knocked Out'",
                },
                {
                  trait : "Armor",
                  value : "0",
                  description : "Reduces Physical Damage and is a counter to high Power adversaries.",
                },
                {
                  trait : "Fire",
                  value : "0",
                  description : "Critical Strike\nResistance to Fire\nBonus Damage to Air & Water\nReduced Damage to Earth",
                },
                {
                  trait : "Earth",
                  value : "0",
                  description : "Thorns Damage\nResistance to Earth\nBonus Damage to Air & Fire\nReduced Damage to Water",
                },
                {
                  trait : "Water",
                  value : "0",
                  description : "Vampiric Touch\nResistance to Water\nBonus Damage to Fire & Earth\nReduced Damage to Air",
                },
                {
                  trait : "Air",
                  value : "0",
                  description : "Evasion\nResistance to Air\nBonus Damage to Earth & Water\nReduced Damage to Fire",
                }
              ]}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({item}) => {
                const itemNameLC = item.trait.toLowerCase();
                return <Box py={2} my={2} borderBottomWidth={1} borderBottomColor="primary.300">
                  <HStack flex={2} space={1} mb={5} alignItems="center" justifyContent="center">
                    <Icon iconName={itemNameLC} size={60} color={`base.${itemNameLC}`} />
                    <View flex={2} alignItems="center">
                      <Text fontFamily="heading" fontSize={item.value.length === 3 ? 45 : 60} textAlign="center">{item.value}</Text>
                      <Text fontFamily="heading" fontSize={'2xl'}>{item.trait}</Text>
                    </View>
                    <View alignItems='flex-end' flex={4}>
                      <Text textAlign="justify" fontSize="sm">{item.description}</Text>
                    </View>
                  </HStack>
                </Box>
              }}
            />
          </Pane>
        </VStack>
      </ScrollView>
      <ScreenActionButton name="OK" action={() => navigation.push("SelectHero", { heroList })}  />
    </ScreenContainer>
  )
}
