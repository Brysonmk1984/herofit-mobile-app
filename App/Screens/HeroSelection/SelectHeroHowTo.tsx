import React, { useContext, useEffect, useState } from 'react';
import {  FlatList, SectionList,  Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, Icon, IconButton, HStack, Divider } from 'native-base';
import debugErrors from '../../common/debugErrors';
import { GlobalStateContext } from '../../store';
import { getHeroList } from '../../api/authentication';
import ScreenContainer from '../../Components/ScreenContainer';

// How To Select Screen
const SelectHeroHowTo = ({ navigation }) =>{
  const { state, dispatch } = useContext(GlobalStateContext);
  // Make API call to get hero data for the next screen
  const [heroList, setHeroList] = useState([]);
  const DATA = [
    {
      title : "Fire",
      data : ["Critical Strike (Chance for bonus Damage)", "Resistance to Fire", "Bonus Damage to Air & Water", "Weak vs Earth"]
    },
    {
      title : "Earth",
      data : ["Thorns Damage (Damage from enemy is returned)", "Resistance to Earth", "Bonus Damage to Air & Fire", "Weak vs Water",]
    },
    {
      title : "Water",
      data : ["Vampiric Touch (Heal on attack)", "Resistance to Water", "Bonus Damage to Earth & Fire", "Weak vs Air"],
    },
    {
      title : "Air",
      data : ["Evasion (Chance to Dodge elemental Damage)", "Resistance to Air", "Bonus Damage to Earth & Water", "Weak vs Fire"]
    }
  ];
  const Item = ({ title }) => (
    <View >
      <Text>{title}</Text>
    </View>
  );


  useEffect(() =>{

    getHeroList()
    .then((data) =>{
      if(data.error){
        const error = data.error;
        return debugErrors(error);
      }
      
      setHeroList(data);
    });
  }, []);

  return (
    <ScreenContainer>
      <Box alignSelf={{ base: "center", md: "flex-start",
      }} width={72} bg={'brand.100'} shadow={1}>
        <Text textAlign="center"  fontFamily='cursive' pl={5} pr={5}>The Dark Forces have breached the Twilight Seal and are causing havoc across Earth Realm!</Text>
      </Box>
      <Divider my={2} />
      {/* Can't seem to assign fontFamily to heading */}
      <Heading>
        <Text fontSize="xl" fontFamily='heading'>Choosing your Hero:</Text>
      </Heading>
      <Text color={'primary.500'}>Default Stats</Text>
      <FlatList 
        data={[
          {
  
            trait : "Power",
            description : "Physical Damage",
            value : "100"
          },
          {
     
            trait : "Health",
            description : "A Hero's life total",
            value : "100"
          },
          {
     
            trait : "Armor",
            description : "Reduces Physical Damage",
            value : "0"
          },
          {
 
            trait : "Recovery",
            description : "Effects health Recovered per hour & chance to revive early",
            value : "5"
          }
        ]}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({item}) => <Box px={5} py={2} rounded="md" my={2} bg="primary.300">
          <HStack flex={2} space={2} mb={5} alignItems="center" justifyContent="space-between">
            <Text flex="2" fontWeight="bold">{item.trait}</Text>
            <Text flex="4">{item.description}</Text>
            <Text flex="1" fontWeight="bold" fontSize="xl" textAlign="center">{item.value}</Text>
          </HStack>
        </Box>}
      />
      <Divider my={2} />
      <Text  color={'primary.500'}>Elemental Power</Text>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => (item + index).toString()}
        renderItem={({ item }) => (
          <Box px={5} py={2} rounded="md" my={2} bg="primary.200">
            <Item title={item} />
          </Box>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text color={ 
            title === 'Earth' ? 'base.earth':
            title === 'Fire' ? 'base.fire':
            title === 'Air' ? 'base.air':
            title === 'Water' ? 'base.water': 
            'base.aether' }>{title}</Text>
        )}
      />
      <Box p="1" my="3" border={1} borderColor="primary.500">
        <Text color="primary.500" fontSize="xs">The different Heroes have different starting elemental power. These values have only a small impact; ultimately your training and how you spend Quantum Points (talent points) will dictate how your hero developes.</Text>
      </Box>
      <Button onPress={() => navigation.push("SelectHero", { heroList })}>OK</Button>
    </ScreenContainer>
  )
}

export default SelectHeroHowTo;