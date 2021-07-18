import React, { useContext, useEffect, useState, createRef } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Button } from 'react-native';
import { login } from '../../api/authentication';
import { getAvatar } from '../../api/avatar';
import { store } from '../../store';
import debugErrors from '../../common/debugErrors';
import { updateAlerts } from '../../common/helperFunctions';

const SignIn = ({ navigation }) => {
  const { dispatch, state } = useContext(store);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [helperText, setHelperText] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  function handleSignIn(){
    setLoading(true);
    setHelperText('');
    
    login({ email, password })
    .then((data) =>{
      setSuccess(true);
      const { user, tokenObject } : { user : object, tokenObject : string } = data;
      console.log( user, tokenObject );
      
      // User hasn't confirmed email yet
      if(!user.active){
        updateAlerts([{ type : 'error', message : "Please Confirm your Email by Clicking the link in the message sent after registration." }], state, dispatch);
        dispatch({ type: 'SET USER', payload: { user, loggedIn : false } });
        dispatch({ type: 'TOGGLE LOADING', payload: { isLoading : false } });
        return setLoading(false);
      }

      getAvatar({ email : user.email })
      .then((data) =>{
        const { avatar } = data;
        dispatch({ type: 'SET HERO', payload: { hero : avatar } });
        console.log('AVATAR');
        setTimeout(() =>{
          navigation.navigate('App', { screen: 'HomeWrapperScreen', params: { screen : 'Home'} });
        },1500);
      }).catch(error =>{
        throw error;
      })
    }).catch((error) =>{
      updateAlerts([{ type : 'error', message : error.message }], state, dispatch);
      debugErrors(error);
    });
    
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

  useEffect(() => {
    if(email.includes('@')){
      if(password.length >= 8){
        return setFormIsValid(true);
      }
    }
    return setFormIsValid(false);
  }, [email, password]);

  useEffect(() =>{
    updateAlerts([{ type : 'Success', message : 'Default Test Alert' }], state, dispatch);
  }, []);

  function addAlert(){
    const message = Math.random();
    updateAlerts([{ type : 'Success', message }], state, dispatch);
  }


  return (
    <ScrollView>
      <Text>Sign IN Screen</Text>
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
  )
}

export default SignIn;


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