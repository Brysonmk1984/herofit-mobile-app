import React, { useContext, useEffect, useState, createRef } from 'react';
import { View, Text, StyleSheet, Button, FlatList, SectionList } from 'react-native';
import debugErrors from '../common/debugErrors';
import { store } from '../store';
import LoadingWidget from './Loading/LoadingWidget';
import { getHeroList } from '../api/authentication';

import { checkAvatarName } from '../api/avatar';
import DelayInput from "react-native-debounce-input";
//import AuthContext from "./context";
import RegisterComponent from './Auth/Register';
import SignInComponent from './Auth/SignIn';
import SpendQP from './SpendQP';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);


const Loading = () =>{
  return (
    <ScreenContainer>
      <LoadingWidget />
    </ScreenContainer>
  )
};



const SignIn = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
  
  return (
    <ScreenContainer>
      <Text>Sign In Screen</Text>
      <Text>Has Token : { state.jwt } </Text>
      <Button title="Select Hero" onPress={() => {
        dispatch({ type: 'SET NEW USER', payload: { newUser : true }});
        return navigation.navigate('Auth',  { screen : 'SignIn'});
      }} />
      <SignInComponent navigation={navigation} />
    </ScreenContainer>
  )
}

const Register = ({ navigation }) =>{
  const { state, dispatch } = useContext(store);
  
  return (
    <ScreenContainer>
      <RegisterComponent navigation={navigation} />
    </ScreenContainer>
  )
}


// Finalize Hero Selection Screen 
// Name the Hero and get finish initializing hero
const FinalizeHeroSelection = ({ route, navigation }) => {
  const [heroName, setHeroName] = useState(null);
  const [ heroNameIsLegit, setHeroNameIsLegit ] = useState(false);
  const [checkingMessage, setCheckingMessage] = useState(false);
  const [helperText, setHelperText] = useState(null);
  const inputRef = createRef();
  const { state, dispatch } = useContext(store);
  const { hero } = route.params;

  function handleNameInput(name : string): void{
    setCheckingMessage(true);
    checkAvatarName({ name })
    .then((data) =>{
      setCheckingMessage(false);
      if(data.error){
        const error = data.error;
        return debugErrors(error);
      }
      const { availability } = data;
      if(availability){
        setHeroName(name);

        if(name.length >= 3 && name.length <= 25){
          setHelperText(null);
          setHeroNameIsLegit(true);
        }else{
          if(name.length < 3){
            setHelperText("Hero Name must be at least 3 characters");
          }else if(name.length > 25){
            setHelperText("Hero Name must be no more than 25 characters");
          }
          setHeroNameIsLegit(false);
        }
      }else{
        setHelperText("Hero Name is already in use, please select another!");
        setHeroNameIsLegit(false);
      }
    });
    
  }

  function handleFinishSelection(){
    

    const namedHero = {
      name : heroName,
      //qp : 10,
      ...hero
    }

    return navigation.navigate('SpendQP', { hero : namedHero });
  }


  return (
    <View>
      <View>
        {
          checkingMessage ? 
            <View>
              <Text>Checking Availability...</Text>
            </View>
          : helperText ? 
            <View>
              <Text>{ helperText }</Text>
            </View> 
          : null
        }
      </View>
      <DelayInput
        value={heroName}
        minLength={3}
        inputRef={inputRef}
        onChangeText={value => handleNameInput(value)}
        delayTimeout={400}
        placeholder="Hero Name"
        required={true}
        style={{ margin: 10, padding: 10, height: 40, borderColor: "gray", borderWidth: 1 }}
      />
      <Button title="Let's Go!" disabled={!heroNameIsLegit} onPress={() => handleFinishSelection()} />
    </View>
  )
}

const SpendQPScreen = ({ route, navigation }) => {
  return <ScreenContainer>
    <SpendQP route={route} navigation={navigation} />
  </ScreenContainer>
}

// Hero Details Screen
const HeroDetails = ({ route, navigation }) => {
  const { hero } = route.params;

  useEffect(() =>{
    navigation.setOptions({ title: hero.alias });
  }, []);

  return (
    <View>
      <Text>FIRE: {hero.fire} EARTH: {hero.earth} WATER:{hero.water} AIR:{hero.air}</Text>
      <Text>{ hero.history }</Text>
      <Button title="Select" onPress={() => navigation.navigate('FinalizeHeroSelection', { hero })} />
    </View>
  )
}

// Select Hero Screen
const SelectHero = ({ route, navigation }) =>{
  const { state, dispatch } = useContext(store);
  const { heroList } = route.params;

  const Item = ({ hero }) => (
    <View >
      <Button title={hero.alias} onPress={() => navigation.push("HeroDetails", { hero })} />
    </View>
  );

  const renderItem = ({ item }) => (
    <Item hero={item} />
  );


  /// map out each hero in list on screen
  return (
    <ScreenContainer>
      <Text>Select Hero Screen</Text>
      <Text>Choose from many heroes</Text>
      <FlatList
        data={heroList}
        renderItem={renderItem}
        keyExtractor={(item, i) => i.toString()}
      />
      
    </ScreenContainer>
  )
}

// How To Select Screen
const SelectHeroHowTo = ({ navigation }) =>{
  const { state, dispatch } = useContext(store);
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
      <Text>The Dark Forces have breached the Twilight Seal and are causing havoc across Earth Realm!</Text>
      <Text>It's up to you Hero, to grow strong through training and combat these malevolent forces.</Text>
      <Text>Choosing your Hero:</Text>
      <Text>Defaults:</Text>
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
        renderItem={({item}) => <View>
          <Text>{item.trait}</Text>
          <Text>{item.description}</Text>
          <Text>Starting Value: {item.value}</Text>
        </View>}
      />
      <Text>Elemental Power:</Text>
      <SectionList
      sections={DATA}
      keyExtractor={(item, index) => (item + index).toString()}
      renderItem={({ item }) => <Item title={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <Text>{title}</Text>
      )}
    />
    <Text>The different Heroes have different starting elemental power. These values have only a small impact; ultimately your training and how you spend Quantum Points (talent points) will dictate how your hero developes.</Text>

    <Button title="OK" onPress={() => navigation.push("SelectHero", { heroList })} />

    </ScreenContainer>
  )
}




export { Loading, SignIn, Register, SelectHeroHowTo, SelectHero, HeroDetails, FinalizeHeroSelection, SpendQPScreen };