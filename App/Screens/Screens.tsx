import React, { useContext, useEffect, useState, createRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, StyleSheet, Button, FlatList, SectionList } from 'react-native';
import debugErrors from '../common/debugErrors';
import { store } from '../store';
import LoadingWidget from '../LoadingWidget';
import { clearLs } from '../common/helperFunctions';
import { getHeroList } from '../api/authentication';
import { checkAvatarName } from '../api/avatar';
import DelayInput from "react-native-debounce-input";
import Checkbox from 'expo-checkbox';
//import AuthContext from "./context";
import RegisterComponent from './Auth/Register';

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

const Home = ({ navigation }) => {
  const { dispatch, state } = useContext<IStore>(store);
  const hero = state.hero;
  console.log('!HERO', hero);

  function renderHeroDetails(){

    return <View>
      <Text>Hero Name: {hero.name}</Text>
      <Text>Character: {hero.alias}</Text>
    </View>
  }



  return (
    <ScreenContainer>
      { renderHeroDetails() }
      <Button title="Delete JWT" onPress={() => clearLs('herofit-jwt')} />
      <Button title="Drawer" onPress={() => navigation.toggleDrawer()} />
    </ScreenContainer>
  )
}





const SpendQP = ({ route, navigation }) => {
  const { dispatch, state } = useContext<IStore>(store);
  const newUser: boolean = state.newUser;
  const { hero } = route.params;
  const [power, setPower] = useState( newUser ? 100 : 0);
  const [health, setHealth] = useState( newUser ? 100 : 0);
  const [armor, setArmor] = useState( newUser ? 0 : 0);
  const [recovery, setRecovery] = useState( newUser ? 5 : 5);
  const [fire, setFire] = useState( newUser ? 0 : 0);
  const [earth, setEarth] = useState( newUser ? 0 : 0);
  const [water, setWater] = useState( newUser ? 0 : 0);
  const [air, setAir] = useState( newUser ? 0 : 0);
  const [qp, setQP] = useState( newUser ? 5 : 0);

  console.log(hero, newUser);

  // As long as hero has QP, let them increment stats
  const incrementAttribute = function(attribute: string): void{
    if(qp > 0){
      type attributeTuple = [string, number, React.Dispatch<React.SetStateAction<number>>];
      const attributeTuples: attributeTuple[] = [ ['power', power, setPower], ['health', health, setHealth], ['armor', armor, setArmor], ['recovery', recovery, setRecovery], ['fire', fire, setFire], ['earth', earth, setEarth], ['water', water, setWater],['air', air, setAir] ];
  
      const matchingTuple : attributeTuple  = attributeTuples.find((tuple) : boolean => tuple[0] === attribute)!;
      const matchingValue : number = matchingTuple[1];
      const matchingUpdateFunc : React.Dispatch<React.SetStateAction<number>> = matchingTuple[2];
      matchingUpdateFunc(matchingValue + 1);
      setQP(qp - 1);
    }
  }

  // If there if no QP left and the hero has been set,
  useEffect(() =>{
    if(newUser && qp === 0){
      const heroReadyToSave = Object.assign({}, hero, { power, health, armor, recovery, fire, earth, water, air, qp, status : 'New Recruit' });
      dispatch({ type: 'SET NEW USER', payload: { newUser : false }});
      dispatch({ type: 'SET HERO', payload: { hero : heroReadyToSave } });

      return navigation.navigate('Auth', { 
        screen : 'Register'
      });

      
    }
  }, [newUser, state.hero, qp]);


  return (
    <ScreenContainer>
      <View>
        <Text>Stat points effect your battles and recovery</Text>
      </View>
      <View>
        <Text>Power: </Text><Text>{power}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('power')} />
      </View>
      <View>
        <Text>Health: </Text><Text>{health}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('health')} />
      </View>
      <View>
        <Text>Armor: </Text><Text>{armor}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('armor')} />
      </View>
      <View>
        <Text>Recovery: </Text><Text>{recovery}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('recovery')} />
      </View>
      <View>
        <Text>Fire: </Text><Text>{fire}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('fire')} />
      </View>
      <View>
        <Text>Earth: </Text><Text>{earth}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('earth')} />
      </View>
      <View>
        <Text>Water: </Text><Text>{water}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('water')} />
      </View>
      <View>
        <Text>Air: </Text><Text>{air}</Text>
        <Button title={'+'} onPress={() => incrementAttribute('air')} />
      </View>
    </ScreenContainer>
  )

}



const SignIn = ({ navigation }) => {
  const { dispatch, state } = useContext(store);
  
  return (
    <ScreenContainer>
      <Text>Sign In Screen</Text>
      <Text>Has Token : { state.jwt } </Text>
      <Button title="Select Hero" onPress={() => {
        dispatch({ type: 'SET NEW USER', payload: { newUser : true }});
        return navigation.navigate('Auth', { 
          screen : 'SelectHero'
        });
      }} />
      <Button title="Sign In"  onPress={() => navigation.push("Home")} />
    </ScreenContainer>
  )
}

const Register = ({ navigation }) =>{
  const { dispatch, state } = useContext(store);
  
  return (
    <ScreenContainer>
      <RegisterComponent />
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
      ...hero
    }
    // Navigate out of the Auth stack, into App -> HomeWrapperScreen -> WalkthroughStackScreen -> SpendQP
    return navigation.navigate('App', {
      screen: 'HomeWrapperScreen', params: {
          screen : 'WalkthroughStackScreen', params : {
            screen: 'SpendQP', params : { hero : namedHero }
          }
      }
    });
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
  const { dispatch, state } = useContext(store);
  const { heroList } = route.params;
  console.log('HL - ', heroList.length);

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
  const { dispatch, state } = useContext(store);
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
    .then((data) =>{console.log('LOOK', data);
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




export { Home, Loading, SignIn, Register, SelectHeroHowTo, SelectHero, HeroDetails, FinalizeHeroSelection, SpendQP };