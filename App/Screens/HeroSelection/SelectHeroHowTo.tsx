import React, { useEffect, useState } from 'react';
import {  FlatList, ScrollView,  Box, View, Text, VStack, HStack } from 'native-base';
import debugErrors from '../../common/debugErrors';
import { getHeroList } from '../../api/authentication';
import { ScreenContainer, Header, Subheader, ScreenActionButton, Pane, Icon, StatDisplay } from '../../Components/CustomComponents';
import defaultStats from '../../common/defaultStats.json';
import { AuthStackProps } from '../../common/types-navigator';

// How To Select Screen
export default function SelectHeroHowTo({ navigation, route } : AuthStackProps<'SelectHeroHowTo'>){
  // Make API call to get hero data for the next screen
  const [heroList, setHeroList] = useState([]);
  console.log('HL', heroList);
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
              data={defaultStats.filter(item => item.stat !== 'Aether')}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({item}) => {
                console.log('ITEM', item);
   
                return <Box py={2} my={2} borderBottomWidth={1} borderBottomColor="primary.300">
                  <StatDisplay stat={item.stat} value={item.value} description={item.description}  />
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
