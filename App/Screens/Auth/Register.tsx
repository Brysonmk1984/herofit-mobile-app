import React, { useContext, useEffect, useState, createRef } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Button } from 'react-native';
import Checkbox from 'expo-checkbox';
import { register } from '../../api/authentication';
import { insertAvatar } from '../../api/avatar';
import { store } from '../../store';
import debugErrors from '../../common/debugErrors';
import { updateAlerts } from '../../common/alerts';
import ScreenContainer from '../../Components/ScreenContainer';

const Register = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
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
        <Text>Register Screen</Text>
        <TextInput
          style={styles.input}
          onChangeText={email => handleEmailInput(email)}
          value={email}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          onChangeText={text => setFirstName(text)}
          value={firstName}
          placeholder="First Name"
        />
        <TextInput
          style={styles.input}
          onChangeText={text => setLastName(text)}
          value={lastName}
          placeholder="Last Name"
        />
        <TextInput
          style={styles.input}
          onChangeText={text => setDisplayName(text)}
          value={displayName}
          placeholder="Display Name"
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
        <TextInput
          style={styles.input}
          onChangeText={text => handlePasswordConfirmInput(text)}
          value={passwordConfirm}
          secureTextEntry={true}
          textContentType="password"
          placeholder="Confirm Password"
        />
        <View>
          <Text>{ helperText }</Text>
        </View>
        <Checkbox
          style={styles.checkbox}
          value={emailMarketingOptIn}
          onValueChange={(e) => setEmailMarketingOptIn(e)}
          color={marketingIsChecked ? '#4630EB' : undefined}
        />
        <View>
          <Text>Receive content-related Emails once every few months or so (we'll never sell your data).</Text>
        </View>
        <View>
          <Button title="Submit" disabled={formIsValid ? false : true} onPress={handleRegister} />
        </View>
      </ScrollView>
    </ScreenContainer>
  )
}

export default Register;


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

    margin: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
  },
});