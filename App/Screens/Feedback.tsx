import React, { useState, useContext } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, ScrollView } from "native-base";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import { Store, User } from "../common/types";
import { updateAlerts } from "../common/alerts";
import debugErrors from "../common/debugErrors";
import { GlobalStateContext } from "../store";
import { emailContactForm } from "../api/email";
import { MainDrawerParamList } from "../common/types-navigator";
import FeedbackForm from "../Components/Forms/FeedbackForm";
import { Header } from "../Components/CustomComponents";

const Feedback: React.FC<MainDrawerParamList> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { user, hero, isSignedIn } = state;

  // const [email, setEmail] = useState(isSignedIn ? hero.email : "");
  // const [message, setMessage] = useState("");

  // // Handle change of email input and elements and update states
  // function handleEmailChange(e) {
  //   const email = e.target.value;
  //   setEmail(email);
  // }

  // // Handle change of textarea and update states
  // function handleMessageChange(e) {
  //   const message = e.target.value;
  //   setMessage(message);
  // }

  // // Handle submit of form: send form data to back end, which handles sending the email logic
  function handleSubmit(body: { email: string; message: string }) {
    console.log("submit", body);
    //dispatch({ type: "TOGGLE LOADING" });

    // emailContactForm({ email, message, accountInfo: user })
    //   .then(data => {
    //     updateAlerts([{ type: "success", message: "Message sent! We will get back to you shortly!" }], state, dispatch);
    //     setMessage("");
    //     dispatch({ type: "TOGGLE LOADING" });
    //   })
    //   .catch(error => {
    //     // Error sending Form Message
    //     const errorMessage = debugErrors(error, user);
    //     updateAlerts([{ type: "error", message: `${errorMessage}` }], state, dispatch);
    //     dispatch({ type: "TOGGLE LOADING" });
    //   });
  }

  return (
    <ScreenContainer screenName={route.name}>
      <ScrollView>
        <Header text="Feedback" />
        <FeedbackForm formAction={body => handleSubmit(body)} />
      </ScrollView>
    </ScreenContainer>
  );
};

export default Feedback;
