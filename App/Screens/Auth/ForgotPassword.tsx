import React, { useContext, useEffect, useState } from "react";
import { View, Text, VStack, FormControl, Input, Link } from "native-base";
import { GlobalStateContext } from "../../store";
import debugErrors from "../../common/debugErrors";
import { Header, ScreenContainer, ScreenActionButton, Pane, HelperText } from "../../Components/CustomComponents";
import { useDebouncedCallback } from "use-debounce";
import { AuthStackProps } from "../../common/types-navigator";
import { resetPassword, sendPasswordResetEmailVerification } from "../../api/authentication";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import useGlobalToast from "../../common/hooks/useGlobalToast";

const ForgotPassword = ({ navigation, route }: AuthStackProps<"ForgotPassword">) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { addToast } = useGlobalToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [helperText, setHelperText] = useState(null);
  const [token, setToken] = useState(null);

  async function handleReset() {
    setLoading(true);
    setHelperText("");

    try {
      await resetPassword({ email, token, password });
      setLoading(false);
      addToast("success", "Password has been updated!");
      setTimeout(() => {
        navigation.navigate("SignIn");
      }, 2500);
    } catch (error) {
      debugErrors(error);
      setLoading(false);
      addToast("error", `${error.status}: ${error.message}`);
    }
  }

  async function handleSendEmailConfirmation() {
    try {
      await sendPasswordResetEmailVerification({ email, isApp: true });
      addToast("success", "Please check your email to verify account. Check your spam folder if the message is not in your inbox.");
    } catch (error) {
      debugErrors(error);
      addToast("error", `${error.status}: ${error.message}`);
    }
  }

  // TODO AFTER STANDALONE APP
  // Finishing implementing Redirect from clicking email back to app
  function handleForgotPasswordRedirect() {}

  useEffect(() => {
    if (token) {
      // When the user has returned to the screen from clicking on the app...
      // Check to make sure the email, password, and new password are valid
      if (email.includes("@")) {
        if (password.length >= 8) {
          if (passwordConfirm === password) {
            return setFormIsValid(true);
          }
        }
      }
      return setFormIsValid(false);
    } else {
      // If user hasn't clicked link in email, only check email field
      if (email.includes("@")) {
        return setFormIsValid(true);
      }
    }
  }, [email, password, passwordConfirm]);

  const debounced = useDebouncedCallback(() => {
    if (email.includes("@")) {
      if (password.length >= 8) {
        setHelperText(null);
        return setFormIsValid(true);
      } else {
        if (password.length) {
          setHelperText("Password must be at least 8 characters");
          return setFormIsValid(false);
        }
        setHelperText(null);
      }
    } else {
      setHelperText("Must be valid email address");
    }
    setFormIsValid(false);
  }, 500);

  function handleInputChange(text: string, updateFunction: React.Dispatch<React.SetStateAction<string>>) {
    updateFunction(text);
    debounced();
  }

  function handleInitialEmailChange(email: string, updateFunction: React.Dispatch<React.SetStateAction<string>>) {
    updateFunction(email);
    if (email.includes("@")) {
      setHelperText(null);
      return setFormIsValid(true);
    }
    setHelperText("Must be valid email address");
    setFormIsValid(false);
  }

  return (
    <ScreenContainer screenName={route.name}>
      <View>
        <Header text="Forgot Password" />
        {token ? (
          // Show Password inputs
          <Pane>
            <VStack space={6} mt={5}>
              <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
                <FormControl.Label>Email</FormControl.Label>
                <Input onChangeText={text => handleInputChange(text, setEmail)} value={email} autoCompleteType="email" textContentType="emailAddress" placeholder="Enter Email" onSubmitEditing={handleReset} />
              </FormControl>
              <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
                <FormControl.Label>New Password</FormControl.Label>
                <Input onChangeText={text => handleInputChange(text, setPassword)} value={password} secureTextEntry={true} autoCompleteType="password" textContentType="password" placeholder="Enter Password" onSubmitEditing={handleReset} />
              </FormControl>
              <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
                <FormControl.Label>Confirm Password</FormControl.Label>
                <Input onChangeText={text => handleInputChange(text, setPasswordConfirm)} value={passwordConfirm} secureTextEntry={true} autoCompleteType="password" textContentType="password" placeholder="Confirm Password" onSubmitEditing={handleReset} />
              </FormControl>
              {helperText && <HelperText type={formIsValid ? "success" : "error"} text={helperText} />}
              <View alignItems="center">
                <Link onPress={() => navigation.push("SignIn")} mt={1} mb={1}>
                  Back To Sign In
                </Link>
              </View>
            </VStack>
          </Pane>
        ) : (
          // Show Email input
          <Pane>
            <VStack space={6} mt={5}>
              <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
                <FormControl.Label>What's your sign up email?</FormControl.Label>
                <Input onChangeText={text => handleInitialEmailChange(text, setEmail)} value={email} autoCompleteType="email" textContentType="emailAddress" placeholder="Enter Email" onSubmitEditing={handleSendEmailConfirmation} />
              </FormControl>
              {helperText && <HelperText type={formIsValid ? "success" : "error"} text={helperText} />}
              <View alignItems="center">
                <Link onPress={() => navigation.push("SignIn")} mt={1} mb={1}>
                  Back To Sign In
                </Link>
              </View>
            </VStack>
          </Pane>
        )}
      </View>

      <ScreenActionButton text={token ? `Update Password` : "Confirm Email"} disabled={formIsValid ? false : true} action={token ? handleReset : handleSendEmailConfirmation} />
    </ScreenContainer>
  );
};

export default ForgotPassword;
