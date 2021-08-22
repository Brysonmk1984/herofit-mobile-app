import React, { useState, useEffect, useContext, useReducer } from "react";
import { Image, Pressable, FlatList, SectionList,  Box, Center, ScrollView, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from 'native-base';
import { GlobalStateContext } from '../store';
import spendQPReducer from '../common/SpendQPReducer';
import { updateAlerts } from '../common/alerts';
import { fetchAstrologySeason } from '../api/calculate';
import debugErrors from '../common/debugErrors';
import { Stats, InitialHero, Hero } from '../common/types';
import { ScreenContainer, Header, Subheader, ScreenActionButton, LoreText, Pane, StatDisplay, Icon, HelperText } from '../Components/CustomComponents';
import defaultStats from '../common/defaultStats.json';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';


interface NavigatorProps {
  route: RouteProp<any,any>
  navigation: StackNavigationProp<any,any>
}

/*
  FOR TESTING SPENDQP PAGE
*/
// const mockHero = {
//   "character": "Chrono Guy",
//   "alias": "Chrono Guy",
//   "description": "Time Traveling Renegade",
//   "history": "This enigmatic time traveler has been appearing with increasing frequency as the world has descended into chaos. While he has explained publicly that he's from two thousand years in the future and here to 'maintain the timeline of order', it's unclear what his exact motives are, who he works for and what the implications are of his very existence.",
//   "image": "../../../assets/images/heroes/chrono_guy/chrono_guy.webp",
//   "fire": 0,
//   "earth": 0,
//   "water": 0,
//   "air": 10,
//   "colors": [
//       "#4B4B4B",
//       "#E25926"
//   ]
// }

/* TS - React function component that takes in one parameter called Navigator Props
  The parameter type is referencing the NavigatorProps Generic passed in,
  Which is referencing the NavigatorProps Interface
*/
const SpendQP : React.FC<NavigatorProps> = ({ route, navigation } : NavigatorProps ) => {
  // Global State
  const { state, dispatch } = useContext(GlobalStateContext);

  // Hero is passed as a route param if it's a new user, otherwise grab the hero from state
  const hero = route.params.hero || state.hero;
  const newUser : boolean = state.newUser;
  /*
  FOR TESTING SPENDQP PAGE
*/
  //const hero = mockHero;
  //const newUser = true;




  const initialState : Stats = { qp : newUser ? 10 : hero.qp, power : 100, health : 100, armor : 0, recovery : 5, fire : 0, earth : 0, water : 0, air : 0, aether : 0, qpPower : 0, qpHealth : 0, qpArmor : 0, qpRecovery : 0, qpFire : 0, qpEarth : 0, qpAir : 0, qpWater : 0, qpAether : 0 };
  const [ qpState, qpDispatch ] = useReducer(spendQPReducer, initialState);
  console.log('QP STATE', qpState);
  const attributes = ['Power', 'Health', 'Armor', 'Recovery', 'Fire', 'Earth', 'Water', 'Air', 'Aether'];
  const qpAttributes = attributes.map((attr) =>{
      const lcAttr = attr.toLowerCase();
      return {
        "stat" : attr,
        "value" : qpState[lcAttr],
        "description" : defaultStats.find(item => item.stat === attr).description
      }
  });
  // As long as hero has QP, let them increment stats
  const incrementAttribute = function(stat: string): void{
    console.log(qpState);
    if(qpState.qp > 0){
      return qpDispatch({ type : 'INCREMENT VALUE', payload : { stat } });
    }else if(newUser && qpState.qp === 0){

      
      //dispatch({ type: 'SET NEW USER', payload: { newUser : false }});
      _handleFinishSpendingQP();
    }else{
      // TODO: write code for spending all QP when NOT new user
    }
  }

  function _handleFinishSpendingQP(){
    // If there if no QP left and the hero has been set,
    const updatedHero = Object.assign({}, hero, { ...qpState, status : 'New Recruit' });
    console.log('UH=', updatedHero);
    const defaultHeroProperties = { statusFade : 0, equipped : [], goToBattle : false, restedEnough : true, healthRegenRate : 4, photonTokens : 0, activityXP : 0, battleXP : 0, thisLevelStartXp : 0, nextLevelStartXp : 67, battleDkos : 0, battleDraws : 0, battleLosses : 0, battleWins : 0, maxHealth : updatedHero.health, hasBeenUpgraded : false, }
    const updatedHeroWithDefaults : InitialHero = Object.assign(updatedHero, defaultHeroProperties)
    dispatch({ type: 'SET HERO', payload: { hero : updatedHeroWithDefaults } });
    navigation.navigate('Auth', { screen : 'Register' });
  }


  
  
  useEffect(() =>{
    if(state.newUser === true){

      // Fetch Astrology season for initial bonus based on season
      (async() =>{
        try{
          const elmPackage = await fetchAstrologySeason({ date : null });
          const sign = elmPackage.sign;
          const element = elmPackage.element.toLowerCase();
  
          qpDispatch({ type : 'ASTRO INCREMENT BY 5', payload : { stat : element } });
          updateAlerts([{ type : 'info', message : `+5 ${element} bonus for ${sign} season!` }], state, dispatch);
        }catch(error){
          debugErrors(error);
        }

      })();
    }
  }, [state.newUser]);

  return (
    <ScreenContainer screenName={route.name}>
      <Header text={`Quantum Points [${qpState.qp}]`} />
      { newUser &&  <Center mt={0} mb={5}>
        <Heading >
          <Text color="primary.800" fontFamily='heading' fontSize="xl">
            Stat points affect your battles and recovery
          </Text>
        </Heading>
      </Center>   
    }
      <ScrollView>
      <FlatList 
          data={qpAttributes.filter(item => item.stat !== 'Aether')}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({item}) => {
      
            const lcStatName = item.stat.toLowerCase();
            return <Box  borderRadius={10} bg={`base.${lcStatName}`} my={2} borderBottomWidth={1} borderBottomColor="primary.300" shadow={5}>
              <HStack alignItems="center" space={0}>
                <View flex={4}>
                  <StatDisplay iconWatermark reversedText={true} stat={item.stat} value={item.value} description={item.description}  />
                </View>

                <Pressable ml={2} alignItems="center" justifyContent="center" h={100} borderTopRightRadius={10} borderBottomRightRadius={10} flex={1} bg="base.white" opacity={1} onPress={() => incrementAttribute(lcStatName)}>
                  <Text textAlign="center" color={`base.${lcStatName}`} fontSize={65}>+</Text>
                </Pressable>
              </HStack>

            </Box>
          }}
        />
      </ScrollView>
      
      <ScreenActionButton name="Let's Go!" action={_handleFinishSpendingQP}  />
    </ScreenContainer>
  )
}

export default SpendQP;