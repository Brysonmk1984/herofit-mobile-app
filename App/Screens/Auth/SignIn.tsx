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
import { Store, AppDispatchAction, AppState, AppDispatch } from '../../common/types';

interface Navigation {
  navigate: (p1: string, p2: { screen: string, params?: { screen: string } }) => void
}

interface SignInProps {
  navigation: Navigation
}


const SignIn : FC<SignInProps>  = ({ navigation }) => {
  const { state, dispatch } = useContext(GlobalStateContext);

  console.log('SIGNIN', state, dispatch);
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


  return (
    <ScreenContainer>
      <View style={ styles.container }>
        <ScrollView>
          <Center>
            <Heading><Text fontFamily='heading' fontSize="5xl">Sign IN</Text></Heading>
          </Center>    

            <View variant="pane">
              <VStack space={2} mt={5}>
                <FormControl>
                  <Input
                    onChangeText={email => handleEmailInput(email)}
                    value={email}
                    placeholder="Email"
                    shadow={1}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    onChangeText={text => handlePasswordInput(text)}
                    value={password}
                    secureTextEntry={true}
                    autoCompleteType="password"
                    textContentType="password"
                    placeholder="Password"
                  />
                </FormControl>
              </VStack>
            </View>
            <View>
              <Text>{ helperText }</Text>
            </View>
            <View>
              <Button /*colorScheme="water"*/ variant="solid" /*_text={ { color : 'base.water' } }*/ disabled={formIsValid ? false : true} onPress={handleSignIn}>Submit</Button>
            </View>

        </ScrollView>
      </View>
    </ScreenContainer>
  )
}

export default SignIn;


const styles = StyleSheet.create({


});