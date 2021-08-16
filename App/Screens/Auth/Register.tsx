import React, { useContext, useEffect, useState, useReducer, createRef } from 'react';
import { StyleSheet } from 'react-native';
import {  ScrollView, NativeBaseProvider, Box, View, Text, Heading, VStack, FormControl, Input, Checkbox, Link, Button, Icon, IconButton, HStack, Divider } from 'native-base';
import { register } from '../../api/authentication';
import { insertAvatar } from '../../api/avatar';
import { GlobalStateContext } from '../../store';
import debugErrors from '../../common/debugErrors';
import { updateAlerts } from '../../common/alerts';
import ScreenContainer from '../../Components/ScreenContainer';
import { Header, ScreenActionButton, Pane, HelperText } from '../../Components/CustomComponents';
import { useDebouncedCallback } from 'use-debounce';

function formReducer(state, action){
  function checkValidForm({ email, displayName, password, passwordConfirm }){
    if(email.includes('@')){
      if(displayName.length){
        if(password.length >= 8){
          if(passwordConfirm === password){
            return { formIsValid : true, helperText : '' };
          }else{
            return { formIsValid : false, helperText : 'Password must match' };
          }
        }else{
          return { formIsValid : false, helperText : "Password must be at least 8 characters" }
        }
      }else{
        return { formIsValid : false, helperText : "Display Name is Required" }
      }
    }else{
      return { formIsValid : false, helperText : "Must be valid email address" }
    }
  }

  function determineDisplayName(firstName : string, lastName : string){
    if(!firstName && !lastName){
      return '';
    }
    return `${firstName} ${ lastName ? lastName[0] : '' }`.trim();
  }

  switch(action.type){
    case 'emailInput':{
      const updatedState = { ...state, email : action.email };
      const { formIsValid, helperText } = checkValidForm(updatedState);
      return { ...updatedState, formIsValid, helperText }
    }
    case 'firstNameInput':{
      return { ...state, firstName : action.firstName };
    }
    case 'lastNameInput':{
      return { ...state, lastName : action.lastName };
    }
    case 'displayNameInput': {
      const updatedState = { ...state, displayName : action.displayName };
      const { formIsValid, helperText } = checkValidForm(updatedState);
      return { ...updatedState, formIsValid, helperText }
    }
    case 'passwordInput':{
      const updatedState = { ...state, password : action.password };
      const { formIsValid, helperText } = checkValidForm(updatedState);
      return { ...updatedState, formIsValid, helperText }
    }
    case 'passwordConfirmInput':{
      const updatedState = { ...state, passwordConfirm : action.passwordConfirm };
      const { formIsValid, helperText } = checkValidForm(updatedState);
      return { ...updatedState, formIsValid, helperText }
    }
    case 'emailMarketingOptInToggle':{
      return { ...state, emailMarketingOptIn : action.emailMarketingOptIn };
    }
    case 'autoFillDisplayName':
      const displayName = determineDisplayName(action.firstName, action.lastName);
      const updatedState = { ...state, displayName }
      const { formIsValid, helperText } = checkValidForm(updatedState);
      return { ...updatedState, displayName, formIsValid, helperText };
    default:
      throw new Error('No Matching Action');
  }
}

const Register = ({ navigation, route }) => {
  console.log(navigation, route);
  const { state, dispatch } = useContext(GlobalStateContext);
  const initialFormState = {
    email : '',
    firstName : '',
    lastName : '',
    displayName : '',
    password : '',
    passwordConfirm : '',
    emailMarketingOptIn : true,
    helperText : '',
    formIsValid : false
  };
  const [ formState, formDispatch ] = useReducer(formReducer, initialFormState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);



  // first time signup, need to insert avinsertAvatarIntoDb
  async function handlePostRegister(user){
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

  async function handleSignUp(){
    setLoading(true);
    const { email, firstName, lastName, username : displayName, password, emailMarketingOptIn } = state;

    try{
      const data = await register({ email, firstName, lastName, username : displayName, password, emailMarketingOptIn });
      setSuccess(true);
      const { user, tokenObject } : { user : object, tokenObject : string } = data;

      updateAlerts([{ type : 'success', message : "Please check your email to verify account. Check your spam folder if the message is not in your inbox.", persist : true }], state, dispatch);
      handlePostRegister(user);
    }catch(error){
      updateAlerts([{ type : 'error', message : error.message }], state, dispatch);
      debugErrors(error);
    }

  }


  const debouncedDisplayNameAutoFill = useDebouncedCallback((dispatchAction) => {
    formDispatch(dispatchAction);
  },500);

  useEffect(() =>{
    const { firstName, lastName, displayName } = formState;
    if(!displayName){
      debouncedDisplayNameAutoFill({ type : 'autoFillDisplayName', firstName, lastName});
    }else if(displayName === firstName && lastName){
      debouncedDisplayNameAutoFill({ type : 'autoFillDisplayName', firstName, lastName});
    }
  }, [formState.firstName, formState.lastName]);


  return (
    <ScreenContainer screenName={route.name}>
      <ScrollView mb={5}>
        <Header text="Sign Up" mb={2} />
        <Pane mb={3}>
          <VStack space={2} mt={0}>
            <FormControl>
              <Input
                onChangeText={email => formDispatch({ type : 'emailInput', email })}
                value={formState.email}
                placeholder="Email"
                py={1}
              />
            </FormControl>
            <FormControl>
              <Input
                onChangeText={firstName => formDispatch({ type : 'firstNameInput', firstName })}
                value={formState.firstName}
                placeholder="First Name (Optional)"
                py={1}
              />
            </FormControl>
            <FormControl>
              <Input
              onChangeText={lastName => formDispatch({ type : 'lastNameInput', lastName })}
              value={formState.lastName}
              placeholder="Last Name (Optional)"
              py={1}
            />
            </FormControl>
            <FormControl>
              <Input
                onChangeText={displayName => formDispatch({ type : 'displayNameInput', displayName })}
                value={formState.displayName}
                placeholder="Display Name"
                py={1}
              />
            </FormControl>
            <FormControl>
              <Input
                onChangeText={password => formDispatch({ type : 'passwordInput', password })}
                value={formState.password}
                secureTextEntry={true}
                autoCompleteType="password"
                textContentType="password"
                placeholder="Password"
                py={1}
              />
            </FormControl>
            
            <FormControl>
              <Input
                onChangeText={passwordConfirm => formDispatch({ type : 'passwordConfirmInput', passwordConfirm })}
                value={formState.passwordConfirm}
                secureTextEntry={true}
                textContentType="password"
                placeholder="Confirm Password"
                py={1}
              />
            </FormControl>
            <FormControl>
              <HStack my={2} px={0}>
                <Checkbox
                  value={formState.emailMarketingOptIn}
                  onValueChange={(emailMarketingOptIn) => formDispatch({ type : 'emailMarketingOptInToggle', emailMarketingOptIn })}
                  color={formState.emailMarketingOptIn ? '#4630EB' : undefined}
                  accessibilityLabel="This is an email optin checkbox"
                  defaultIsChecked
                />
                <Text px={5} mt={-1}>Receive content-related emails no more than once per month</Text>
              </HStack>
            </FormControl>
            { formState.helperText ? <HelperText text={formState.helperText} />  : null }
          </VStack>
        </Pane>
      </ScrollView>
      <ScreenActionButton name="Let's Go!" disabled={formState.formIsValid ? false : true} action={handleSignUp}  />
    </ScreenContainer>
  )
}

export default Register;