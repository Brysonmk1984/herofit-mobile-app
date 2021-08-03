import React, { useState, useEffect, useContext, useReducer } from "react";
import { View, Text, Button } from "react-native";
import { store } from '../store';
import spendQPReducer from '../common/SpendQPReducer';
import { updateAlerts } from '../common/alerts';
import { fetchAstrologySeason } from '../api/calculate';
import debugErrors from '../common/debugErrors';
import { Stats } from '../common/types';
import ScreenContainer from '../Components/ScreenContainer';

const SpendQP = ({ route, navigation }) => {
  // Global State
  const { state, dispatch } = useContext(store);

  // Hero is passed as a route param if it's a new user, otherwise grab the hero from state
  const hero = route.params.hero || state.hero;
  const newUser : boolean = state.newUser;
  const initialState : Stats = { qp : newUser ? 10 : hero.qp, power : 100, health : 100, armor : 0, recovery : 5, fire : 0, earth : 0, water : 0, air : 0, aether : 0, qpPower : 0, qpHealth : 0, qpArmor : 0, qpRecovery : 0, qpFire : 0, qpEarth : 0, qpAir : 0, qpWater : 0, qpAether : 0 };
  const [ qpState, qpDispatch ] = useReducer(spendQPReducer, initialState);


  // As long as hero has QP, let them increment stats
  const incrementAttribute = function(stat: string): void{
    if(qpState.qp > 0){
      return qpDispatch({ type : 'INCREMENT VALUE', payload : { stat } });
    }else if(newUser && qpState.qp === 0){
      // If there if no QP left and the hero has been set,
      const updatedHero = Object.assign({}, hero, { ...qpState, status : 'New Recruit' });
      
      dispatch({ type: 'SET NEW USER', payload: { newUser : false }});
      dispatch({ type: 'SET HERO', payload: { hero : updatedHero } });

      return navigation.navigate('Auth', { screen : 'Register' });
    }else{
      // TODO: write code for spending all QP when NOT new user
    }
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
    <ScreenContainer>
      <View>
        <Text>Stat points effect your battles and recovery</Text>
      </View>
      <View>
        <Text>Power: </Text><Text>{qpState.power}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('power')} />
      </View>
      <View>
        <Text>Health: </Text><Text>{qpState.health}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('health')} />
      </View>
      <View>
        <Text>Armor: </Text><Text>{qpState.armor}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('armor')} />
      </View>
      <View>
        <Text>Recovery: </Text><Text>{qpState.recovery}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('recovery')} />
      </View>
      <View>
        <Text>Fire: </Text><Text>{qpState.fire}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('fire')} />
      </View>
      <View>
        <Text>Earth: </Text><Text>{qpState.earth}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('earth')} />
      </View>
      <View>
        <Text>Water: </Text><Text>{qpState.water}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('water')} />
      </View>
      <View>
        <Text>Air: </Text><Text>{qpState.air}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('air')} />
      </View>
      <View>
        <Text>Aether: </Text><Text>{qpState.aether}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('aether')} />
      </View>
    </ScreenContainer>
  )
}

export default SpendQP;