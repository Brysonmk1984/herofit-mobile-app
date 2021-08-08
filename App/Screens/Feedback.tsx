import React, { useState, useContext } from 'react';
import { NativeBaseProvider, Box, Center } from 'native-base';
import { View, Text } from 'react-native';
import ScreenContainer from '../Components/ScreenContainer';
import { Store, User } from '../common/types';
import { updateAlerts } from '../common/alerts';
import debugErrors from '../common/debugErrors';
import { GlobalStateContext } from '../store';
import { emailContactForm } from '../api/email';


interface FeedbackProps {

}

const Feedback: React.FC<FeedbackProps> = ({ navigation }) => {
  const { state, dispatch } = useContext<Store>(GlobalStateContext);
  const { user, hero, isSignedIn } = state;

  const [email, setEmail] = useState(isSignedIn ? hero.email : '');
  const [message, setMessage] = useState('');

  // Handle change of email input and elements and update states
  function handleEmailChange(e){
    const email = e.target.value;
    setEmail(email);
  }

  // Handle change of textarea and update states
  function handleMessageChange(e){
    const message = e.target.value;
    setMessage(message);
  }

  // Handle submit of form: send form data to back end, which handles sending the email logic
  function handleSubmit(e){
    e.preventDefault();
    dispatch({ type : 'TOGGLE LOADING'});

    emailContactForm({ email, message, accountInfo : user })
    .then((data) =>{
      updateAlerts([{type : 'success', message : "Message sent! We will get back to you shortly!"}], state, dispatch);
      setMessage('');
      dispatch({ type : 'TOGGLE LOADING'});
    }).catch((error) =>{
      // Error sending Form Message
      const errorMessage = debugErrors(error, user);
      updateAlerts( [{type : 'error', message : `${errorMessage}`}], state, dispatch);
      dispatch({ type : 'TOGGLE LOADING'});
    });
  }

  return (
    <NativeBaseProvider>
      <Center flex={1}>
        Feedback Page
      </Center>
    </NativeBaseProvider>
  );

}

export default Feedback;