import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, Button } from 'react-native';
import { store } from './store';
import LoadingWidget from './LoadingWidget';
import { clearLs } from './common/helperFunction';
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


const Details = () =>{
  <ScreenContainer>
    <Text>Details Screen</Text>
  </ScreenContainer>
}

const Search = ({ navigation }) =>(
  <ScreenContainer>
    <Text>Search Screen</Text>
    <Button title="Search 2" onPress={() => alert('TODO')} />
    <Button title="React native school" onPress={() => alert(2)} />
  </ScreenContainer>
)

const Profile = ({ navigation }) =>{
  const { dispatch, state } = useContext(store);
  return (
    <ScreenContainer>
      <Text>Profile {state.color} Screen</Text>
      <Button title="Drawer" onPress={() => alert('TODO')} />
      <Button title="Sign Out" onPress={() => alert('signout')} />
    </ScreenContainer>
  )
}

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

const FinalizeHeroSelection = ({ route, navigation }) => {

  return (
    <View>
      <Text>This is where user chooses a hero name</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  )
}



const HeroDetails = ({ route, navigation }) => {
  const { hero } = route.params;
  return (
    <View>
      <Text>Hero Details Screen</Text>
      <Text>This is some text about { hero }</Text>
      <Button title="Select" onPress={() => navigation.navigate('FinalizeHeroSelection')} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  )
}


const SelectHero = ({ navigation }) =>{
  const { dispatch, state } = useContext(store);
  return (
    <ScreenContainer>
      <Text>Select Hero Screen</Text>
      <Text>Choose from many heroes</Text>
      <Button title="Compost Creature" onPress={() => navigation.push("HeroDetails", { hero : 'Compost Creature' })} />
      <Button title="Wildspeaker" onPress={() => navigation.push("HeroDetails", { hero : 'Wildspeaker' })} />
      <Button title="The Empath" onPress={() => navigation.push("HeroDetails", { hero : 'The Empath' })} />
    </ScreenContainer>
  )
}



export { Home, Details, Search, Profile, Loading, SignIn, SelectHero, HeroDetails, FinalizeHeroSelection };