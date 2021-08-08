import React, { useContext, useEffect, useState, createRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {  NativeBaseProvider, Box, View, Text, Heading, VStack, FormControl, Input, Checkbox, Link, Button, Icon, IconButton, HStack, Divider } from 'native-base';
import { register } from '../../api/authentication';
import { insertAvatar } from '../../api/avatar';
import { GlobalStateContext } from '../../store';
import debugErrors from '../../common/debugErrors';
import { updateAlerts } from '../../common/alerts';
import ScreenContainer from '../../Components/ScreenContainer';

const Register = ({ navigation }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailMarketingOptIn, setEmailMarketingOptIn] = useState(true);
  const [helperText, setHelperText] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [marketingIsChecked, setMarketingIsChecked] = useState(true);

  // first time signup, need to insert avinsertAvatarIntoDb
  async function handlePostRegister(user) : void{
    dispatch({ type: 'SET USER', payload: { user, loggedIn : true } });
    
    try {
      const data = await insertAvatar({ avatar : state.hero, email : user.email, userId : user.id });
      console.log('data from inserting av into db', data);
      dispatch({ type: 'SET ISSIGNEDIN', payload: { isSignedIn : true }});
      dispatch({ type: 'SET ALERTS', payload: { alerts : [{type : 'success', message :`Account creation successful!`}] } });
      setTimeout(() =>{
        navigation.navigate('App', { screen: 'HomeWrapperScreen', params: { screen : 'Home'} });
      },1500);
    }catch(error){
      // Error getting Avatar, should only happen if DB connection issues
      debugErrors(error, user);
      updateAlerts([{type : 'error', message :`${error.status}: ${error.message}`}], state, dispatch);
      dispatch({ type: 'TOGGLE LOADING', payload: { isLoading : false } });
    }

  }

  async function handleRegister(){
    setLoading(true);
    setHelperText('');
    
    try{
      const data = await register({ email, firstName, lastName, username : displayName, password, emailMarketingOptIn });
      setSuccess(true);
      const { user, tokenObject } : { user : object, tokenObject : string } = data;
      console.log( user, tokenObject );
      updateAlerts([{ type : 'success', message : "Please check your email to verify account. Check your spam folder if the message is not in your inbox.", persist : true }], state, dispatch);
      handlePostRegister(user);
    }catch(error){
      updateAlerts([{ type : 'error', message : error.message }], state, dispatch);
      debugErrors(error);
    }

  }

  function handleEmailInput(val){
    setEmail(val);
    if(!val.includes('@')){
      setHelperText("Must be valid email address");
    }else{
      setHelperText("");
    }
  }

  function handlePasswordInput(val){
    setPassword(val);
    if(val.length < 8){
      setHelperText("Password must be at least 8 characters");
    }else{
      setHelperText("");
    }
  }

  function handlePasswordConfirmInput(val){
    setPasswordConfirm(val);
    if(val !== password){
      setHelperText("Password must match");
    }else{
      setHelperText("");
    }
  }

  useEffect(() => {
    if(email.includes('@')){
      if(displayName?.length){
        if(password.length >= 8){
          if(passwordConfirm === password){
            return setFormIsValid(true);
          }
        }
      }
    }
    return setFormIsValid(false);
  }, [email, displayName, password, passwordConfirm]);

  return (
    <ScreenContainer>
      <ScrollView>
        <Heading size="lg" color='primary.500'><Text fontFamily='heading' fontSize="3xl">Register Screen</Text></Heading>
        <VStack space={2} mt={5}>
          <FormControl>
            <Input
              onChangeText={email => handleEmailInput(email)}
              value={email}
              placeholder="Email"
            />
          </FormControl>
          <FormControl>
            <Input
              onChangeText={text => setFirstName(text)}
              value={firstName}
              placeholder="First Name (Optional)"
            />
          </FormControl>
          <FormControl>
            <Input
            onChangeText={text => setLastName(text)}
            value={lastName}
            placeholder="Last Name (Optional)"
          />
          </FormControl>
          <FormControl>
            <Input
              onChangeText={text => setDisplayName(text)}
              value={displayName}
              placeholder="Display Name"
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
          
          <FormControl>
            <Input
              onChangeText={text => handlePasswordConfirmInput(text)}
              value={passwordConfirm}
              secureTextEntry={true}
              textContentType="password"
              placeholder="Confirm Password"
            />
          </FormControl>
          
          <View>
            <Text>{ helperText }</Text>
          </View>
          <FormControl>
            <HStack space={2} mb={5}>
              <Checkbox
                value={emailMarketingOptIn}
                onValueChange={(e) => setEmailMarketingOptIn(e)}
                color={marketingIsChecked ? '#4630EB' : undefined}
                accessibilityLabel="This is an email optin checkbox"
                defaultIsChecked
              />
              <Text>Receive content-related Emails once every few months or so (we'll never sell your data).</Text>
            </HStack>

          </FormControl>
          <View>
            <Button disabled={formIsValid ? false : true} onPress={handleRegister}>Submit</Button>
          </View>
        </VStack>
      </ScrollView>
    </ScreenContainer>
  )
}

export default Register;