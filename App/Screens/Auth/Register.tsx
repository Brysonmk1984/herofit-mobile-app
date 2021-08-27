import React, { useContext, useEffect, useState, useReducer, createRef } from "react";
import { StyleSheet } from "react-native";
import { ScrollView, NativeBaseProvider, Box, View, Text, Heading, VStack, FormControl, Input, Checkbox, Link, Button, Icon, IconButton, HStack, Divider } from "native-base";
import { register } from "../../api/authentication";
import { insertAvatar } from "../../api/avatar";
import { GlobalStateContext } from "../../store";
import debugErrors from "../../common/debugErrors";
import { updateAlerts } from "../../common/alerts";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { Header, ScreenActionButton, Pane, HelperText } from "../../Components/CustomComponents";
import { useDebouncedCallback } from "use-debounce";
import { AuthStackProps } from "../../common/types-navigator";
import { User } from "../../common/types";

// prettier-ignore
interface FormState { email: string; firstName: string; username: string; password: string; emailMarketingOptIn: boolean; helperText: string; formIsValid: boolean; }
interface EmailInputAction {
  type: "EMAIL INPUT";
  email: string;
}
interface FirstNameInputAction {
  type: "FIRST NAME INPUT";
  firstName: string;
}
interface UsernameInputAction {
  type: "USERNAME INPUT";
  username: string;
}
interface PasswordInputAction {
  type: "PASSWORD INPUT";
  password: string;
}
interface EmailMarketingOptInToggleAction {
  type: "EMAIL MARKETING OPT IN TOGGLE";
  emailMarketingOptIn: boolean;
}
type FormAction = EmailInputAction | FirstNameInputAction | UsernameInputAction | PasswordInputAction | EmailMarketingOptInToggleAction;

function formReducer(state: FormState, action: FormAction): FormState {
  function checkValidForm({ email, username, password }) {
    if (email.includes("@")) {
      if (username.length) {
        if (password.length >= 8) {
          return { formIsValid: true, helperText: "Looks Good!" };
        } else {
          return { formIsValid: false, helperText: "Password must be at least 8 characters" };
        }
      } else {
        return { formIsValid: false, helperText: "username is Required" };
      }
    } else {
      return { formIsValid: false, helperText: "Must be valid email address" };
    }
  }

  switch (action.type) {
    case "EMAIL INPUT": {
      const updatedState = { ...state, email: action.email };
      const { formIsValid, helperText } = checkValidForm(updatedState);
      return { ...updatedState, formIsValid, helperText };
    }
    case "FIRST NAME INPUT": {
      return { ...state, firstName: action.firstName };
    }
    case "USERNAME INPUT": {
      const updatedState = { ...state, username: action.username };
      const { formIsValid, helperText } = checkValidForm(updatedState);
      return { ...updatedState, formIsValid, helperText };
    }
    case "PASSWORD INPUT": {
      const updatedState = { ...state, password: action.password };
      const { formIsValid, helperText } = checkValidForm(updatedState);
      return { ...updatedState, formIsValid, helperText };
    }
    case "EMAIL MARKETING OPT IN TOGGLE": {
      console.log("LOOK", action.emailMarketingOptIn);
      return { ...state, emailMarketingOptIn: action.emailMarketingOptIn };
    }
    default:
      throw new Error("No Matching Action");
  }
}

const Register = ({ navigation, route }: AuthStackProps<"Register">) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const initialFormState: FormState = {
    email: "",
    firstName: "",
    username: "",
    password: "",
    emailMarketingOptIn: true,
    helperText: "",
    formIsValid: false,
  };
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // first time sign up, need to insert avinsertAvatarIntoDb
  async function handlePostRegister(user: User) {
    dispatch({ type: "SET USER", payload: { user, isSignedIn: true } });

    try {
      const data = await insertAvatar({ avatar: state.hero, email: user.email, userId: user.id });
      console.log("data from inserting av into db", data);
      dispatch({ type: "SET ISSIGNEDIN", payload: { isSignedIn: true } });
      updateAlerts([{ type: "success", message: `Account creation successful!` }], state, dispatch);
      setTimeout(() => {
        //@ts-ignore - Can't figure out how to add strong typing for nested navigators
        navigation.navigate("App");
      }, 1500);
    } catch (error) {
      // Error getting Avatar, should only happen if DB connection issues
      debugErrors(error, user);
      updateAlerts([{ type: "error", message: `${error.status}: ${error.message}` }], state, dispatch);
      dispatch({ type: "TOGGLE LOADING", payload: { isLoading: false } });
    }
  }

  async function handleSignUp() {
    setLoading(true);
    const { email, firstName, username: username, password, emailMarketingOptIn } = formState;

    try {
      const data = await register({ email, firstName, username, password, emailMarketingOptIn });
      setSuccess(true);
      const { user } = data;

      updateAlerts([{ type: "success", message: "Please check your email to verify account. Check your spam folder if the message is not in your inbox.", persist: true }], state, dispatch);
      handlePostRegister(user);
    } catch (error) {
      updateAlerts([{ type: "error", message: error.message }], state, dispatch);
      debugErrors(error);
    }
  }

  return (
    <ScreenContainer screenName={route.name}>
      <Header text="Sign Up" mb={2} />
      <ScrollView mb={5}>
        <Pane mb={3}>
          <VStack space={2} mt={0}>
            <FormControl>
              <Input onChangeText={email => formDispatch({ type: "EMAIL INPUT", email })} value={formState.email} placeholder="Email" />
            </FormControl>
            <FormControl>
              <Input onChangeText={username => formDispatch({ type: "USERNAME INPUT", username })} value={formState.username} placeholder="Username" />
            </FormControl>
            <FormControl>
              <Input onChangeText={firstName => formDispatch({ type: "FIRST NAME INPUT", firstName })} value={formState.firstName} placeholder="First Name (Optional)" />
            </FormControl>
            <FormControl>
              <Input onChangeText={password => formDispatch({ type: "PASSWORD INPUT", password })} value={formState.password} secureTextEntry={true} autoCompleteType="password" textContentType="password" placeholder="Password" />
            </FormControl>
            {formState.helperText ? <HelperText text={formState.helperText} type={formState.formIsValid ? "success" : "error"} /> : null}
            <FormControl>
              <HStack my={2} px={0}>
                <Checkbox colorScheme="success" value={formState.emailMarketingOptIn.toString()} onChange={emailMarketingOptIn => formDispatch({ type: "EMAIL MARKETING OPT IN TOGGLE", emailMarketingOptIn })} accessibilityLabel="This is an email optin checkbox" defaultIsChecked />
                <Text px={5} mt={-1}>
                  Receive content-related emails no more than once per month
                </Text>
              </HStack>
            </FormControl>
          </VStack>
        </Pane>
      </ScrollView>
      <ScreenActionButton name="Let's Go!" disabled={formState.formIsValid ? false : true} action={handleSignUp} />
    </ScreenContainer>
  );
};

export default Register;
