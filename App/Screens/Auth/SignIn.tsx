import React, { useContext, useEffect, useState, FC } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Button } from 'react-native';
import { login } from '../../api/authentication';
import { store } from '../../store';
import debugErrors from '../../common/debugErrors';
import { updateAlerts } from '../../common/alerts';
import fetchInitialData from '../../common/fetchInitialData';
import ScreenContainer from '../../Components/ScreenContainer';
import { StackNavigationProp } from '@react-navigation/stack';
import { Store, AppDispatchAction } from '../../common/types';

interface Navigation {
  navigate: (p1: string, p2: { screen: string, params?: { screen: string } }) => void
}

interface SignInProps {
  navigation: Navigation
}


const SignIn : FC<SignInProps>  = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [helperText, setHelperText] = useState<string | null>(null);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignIn (){
    setLoading(true);
    setHelperText('');
    
    try{
      dispatch({type : 'TOGGLE LOADING', payload : { isLoading : true } });
      const { user, tokenObject }  = await login({ email, password });
      setSuccess(true);
      
      // User hasn't confirmed email yet
      if(!user.active){
        updateAlerts([{ type : 'error', message : "Please Confirm your Email by Clicking the link in the message sent after registration." }], state, dispatch);
        dispatch({ type: 'SET USER', payload: { user, loggedIn : false } });
        dispatch({ type: 'TOGGLE LOADING', payload: { isLoading : false } });
        return setLoading(false);
      }
      
      await fetchInitialData(null, dispatch, state, user.email);
      return dispatch({type : 'TOGGLE LOADING', payload : { isLoading : false } });
    } catch(error){
      let message = debugErrors(error);
      if(Array.isArray(error.debug) && error.debug[0].msg === "Couldn't find a user with that email."){
        message = error.debug[0].msg;
      }
      updateAlerts([{ type : 'error', message }], state, dispatch);
      return dispatch({type : 'TOGGLE LOADING', payload : { isLoading : false } });
    }
  }

  function handleEmailInput(val : string){
    setEmail(val);
    if(!val.includes('@')){
      setHelperText("Must be valid email address");
    }else{
      setHelperText("");
    }
  }

  function handlePasswordInput(val : string){
    setPassword(val);
    if(val.length < 8){
      setHelperText("Password must be at least 8 characters");
    }else{
      setHelperText("");
    }
  }

  useEffect(() => {
    if(email.includes('@')){
      if(password.length >= 8){
        return setFormIsValid(true);
      }
    }
    return setFormIsValid(false);
  }, [email, password]);

  useEffect(() =>{
    if(state.isSignedIn){
      navigation.navigate('App', { screen: 'HomeWrapperScreen', params: { screen : 'Home'} });
    }
   
  }, [state.isSignedIn]);


  function myCB(){
    console.log('works');
  }

  function addAlert(){
    const message = Math.random();
    updateAlerts([{ type : 'success', message, confirm: { text : 'cake', cb : myCB } }], state, dispatch);
  }


  return (
    <ScreenContainer>
      <View style={ styles.container }>
        <ScrollView>
          <Text>Sign IN Screen</Text>
          <Text>Has Token : { Boolean(state.jwt) } </Text>
          <Button title="Select Hero" onPress={() => {
            dispatch({ type: 'SET NEW USER', payload: { newUser : true }});
            return navigation.navigate('Auth',  { screen : 'SignIn'});
          }} />
          <TextInput
            style={styles.input}
            onChangeText={email => handleEmailInput(email)}
            value={email}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            onChangeText={text => handlePasswordInput(text)}
            value={password}
            secureTextEntry={true}
            autoCompleteType="password"
            textContentType="password"
            placeholder="Password"
          />
          <View>
            <Text>{ helperText }</Text>
          </View>
          <View>
            <Button title="Submit" disabled={formIsValid ? false : true} onPress={handleSignIn} />
          </View>
          <Button title="Add Alert" onPress={addAlert}></Button>
        </ScrollView>
      </View>
    </ScreenContainer>
  )
}

export default SignIn;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: 'red',
    width: '100%'
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5
  },
  input: {

    margin: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
  },
});