import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import debugErrors from './common/debugErrors';
import { store } from './store';
import LoadingWidget from './LoadingWidget';
import { clearLs } from './common/helperFunction';
import { getHeroList } from './api/authentication';
//import AuthContext from "./context";

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
  }
});

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const Search = ({ navigation }) =>(
  <ScreenContainer>
    <Text>Search Screen</Text>
    <Button title="Search 2" onPress={() => alert('TODO')} />
    <Button title="React native school" onPress={() => alert(2)} />
  </ScreenContainer>
)

const Loading = () =>{
  return (
    <ScreenContainer>
      <LoadingWidget />
    </ScreenContainer>
  )
};

const Home = ({ navigation }) =>{
  return (
    <ScreenContainer>
      <Text>Home Screen</Text>
      <Button title="Delete JWT" onPress={() => clearLs('herofit-jwt')} />
      <Button title="Drawer" onPress={() => navigation.toggleDrawer()} />
    </ScreenContainer>
  )
}

const SignIn = ({ navigation }) => {
  const { dispatch, state } = useContext(store);
  
  return (
    <ScreenContainer>
      <Text>Sign In Screen</Text>
      <Text>Has Token : { state.jwt } </Text>
      <Button title="Sign In"  onPress={() => navigation.push("Home")} />
      <Button title="Create Account" onPress={() => navigation.push("SignUp")} />
    </ScreenContainer>
  )
}

// Finalize Hero Selection Screen 
// Name the Hero and get finish initializing hero
const FinalizeHeroSelection = ({ route, navigation }) => {

  return (
    <View>
      <Text>This is where user chooses a hero name</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
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
      <Text>This is some text about { hero.alias }</Text>
      <Text>{ hero.history }</Text>
      <Button title="Select" onPress={() => navigation.navigate('FinalizeHeroSelection')} />
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
      <Text>How To Select Screen</Text>
      <Text>Gives a little more information about how and why users should select their hero in the following screen</Text>
      <Button title="OK" onPress={() => navigation.push("SelectHero", { heroList })} />

    </ScreenContainer>
  )
}




export { Home, Search, Loading, SignIn, SelectHeroHowTo, SelectHero, HeroDetails, FinalizeHeroSelection };