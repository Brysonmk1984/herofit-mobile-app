import React, { useContext, useEffect, useState, FC, ReactNode, Context } from 'react';
import { ScrollView, TextInput, StyleSheet } from 'react-native';
import {  NativeBaseProvider, Box, View, Text, Heading, Center, VStack, FormControl, Input, Link, Button, Icon, IconButton, HStack, Divider } from 'native-base';
import { login } from '../../api/authentication';
import { GlobalStateContext } from '../../store';
import debugErrors from '../../common/debugErrors';
import { updateAlerts } from '../../common/alerts';
import fetchInitialData from '../../common/fetchInitialData';
import ScreenContainer from '../../Components/ScreenContainer';
import { StackNavigationProp } from '@react-navigation/stack';
import { Store, AppDispatchAction, AppDispatch } from '../../common/types';
import { Header, ScreenActionButton, Pane, HelperText } from '../../Components/CustomComponents';
import { useDebouncedCallback } from 'use-debounce';
import { RouteProp } from '@react-navigation/native';
interface Navigation {
  navigate: (p1: string, p2: { screen: string, params?: { screen: string } }) => void
}

interface SignInProps {
  navigation: Navigation
}


const SignIn : FC<SignInProps>  = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
console.log('RRRR', route);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [helperText, setHelperText] = useState<string | null>(null);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  async function handleSignIn (){
    setLoading(true);
    setHelperText(null);
    
    try{
      if(!formIsValid ){
        throw new Error("Please complete the form.");
      }
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


  function handleRegisterLink(){
    navigation.navigate('Auth', { screen: 'SelectHero'});
  }

  // function formValidation(arrayOfInputs, ){

  // }

  const debounced = useDebouncedCallback(() => {
      if(email.includes('@')){
        if(password.length >= 8){
          setHelperText(null)
          return setFormIsValid(true);
        }else{
          if(password.length){
            setHelperText("Password must be at least 8 characters");
            return setFormIsValid(false);
          }
          setHelperText(null);
        }
      }else{
        setHelperText("Must be valid email address");
      }
      setFormIsValid(false);
    },500);

  function handleInputChange(text, field, updateFunction){
    updateFunction(text);
    debounced();
  }

  useEffect(() =>{
    if(state.isSignedIn){
      navigation.navigate('Auth', { screen: 'HomeWrapperScreen', params: { screen : 'Home'} });
    }
   
  }, [state.isSignedIn]);

  return (
    <ScreenContainer screenName={route.name}>
      <View>
        <Header text="Sign In" /> 
        <Pane>
          <VStack space={6} mt={5}>         
            <FormControl isRequired isInvalid={helperText === 'Must be valid email address' ? true : false}>
              <Input
                onChangeText={(text) => handleInputChange(text, 'email', setEmail)}
                value={email}
                placeholder="Email"
                shadow={1}
              />
            </FormControl>
            <FormControl isRequired isInvalid={helperText === 'Password must be at least 8 characters' ? true : false}>
              <Input
                onChangeText={(text) => handleInputChange(text, 'password', setPassword)}
                value={password}
                secureTextEntry={true}
                autoCompleteType="password"
                textContentType="password"
                placeholder="Password"
                onSubmitEditing={handleSignIn}
              />
            </FormControl>
            { helperText && <HelperText text={helperText} /> }
            <View alignItems="center">
              <Text color="base.white">- or -</Text>
              <Link onPress={handleRegisterLink} mt={1}>
                GET STARTED
              </Link>
            </View>
          </VStack>
        </Pane>
      </View>

      <ScreenActionButton name="Let's Go!" disabled={formIsValid ? false : true} action={handleSignIn}  />
    </ScreenContainer>
  )
}

export default SignIn;