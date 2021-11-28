import React, { useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { View, Text, VStack, FormControl, Input, Link, Button, Center } from "native-base";
import { GlobalStateContext } from "../../store";
import debugErrors from "../../common/debugErrors";
import { Header, ScreenContainer, ScreenActionButton, Pane, HelperText, LoadingInPane } from "../../Components/CustomComponents";
import { useDebouncedCallback } from "use-debounce";
import { AuthStackProps } from "../../common/types-navigator";
import { resetPassword, sendPasswordResetEmailVerification } from "../../api/authentication";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import PaneActionButton from "../../Components/PaneActionButton";

const ForgotPassword = ({ navigation, route }: AuthStackProps<"ForgotPassword">) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { addToast } = useGlobalToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [helperText, setHelperText] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  // the URL param that's emailed to user and redirected through website
  const [verifyPassword, setVerifyPassword] = useState(null);

  async function handleReset() {
    setLoading(true);
    setHelperText(null);
    setFormIsValid(false);
    try {
      await resetPassword({ email, token: verifyPassword, password });
      setLoading(false);
      addToast("success", "Password has been updated!");
      setTimeout(() => {
        navigation.push("SignIn");
      }, 2000);
    } catch (error) {
      debugErrors(error);
      setLoading(false);
      addToast("error", `${error.status}: ${error.message}`);
    }
  }

  async function handleSendEmailConfirmation() {
    if (emailSent) {
      return;
    }
    setEmailSent(true);
    Keyboard.dismiss();
    try {
      await sendPasswordResetEmailVerification({ email, isMobileApp: true });
      setLoading(false);
      addToast("success", "Please check your email to verify account. Check your spam folder if the message is not in your inbox.");
    } catch (error) {
      setEmailSent(false);
      setLoading(false);
      debugErrors(error);
      addToast("error", `${error.status}: ${error.message}`);
    }
  }

  // TODO AFTER STANDALONE APP
  // Finishing implementing Redirect from clicking email back to app
  function handleForgotPasswordRedirect() {}

  // If a user returns to app, capture URL and set state to value of verifyPassword
  Linking.addEventListener("url", data => {
    const verifyPassword = Linking.parse(data.url)?.queryParams.verifyPassword;
    if (verifyPassword) {
      setVerifyPassword(verifyPassword);
    }
  });

  useEffect(() => {
    if (route.params?.verifyPassword) {
      setVerifyPassword(route.params.verifyPassword);
    }
  }, [route.params?.verifyPassword]);

  const debounced = useDebouncedCallback(() => {
    if (email.includes("@")) {
      if (password.length >= 8) {
        if (passwordConfirm === password) {
          setHelperText(null);
          return setFormIsValid(true);
        } else {
          setHelperText("Passwords must match!");
        }
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
        {verifyPassword ? (
          // Show Password inputs
          <Pane>
            <VStack space={6} mt={5}>
              <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
                <FormControl.Label>Email</FormControl.Label>
                <Input onChangeText={text => handleInputChange(text, setEmail)} value={email} autoCompleteType="email" textContentType="emailAddress" placeholder="Enter Email" />
              </FormControl>
              <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
                <FormControl.Label>New Password</FormControl.Label>
                <Input onChangeText={text => handleInputChange(text, setPassword)} value={password} secureTextEntry={true} autoCompleteType="password" textContentType="password" placeholder="Enter Password" />
              </FormControl>
              <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
                <FormControl.Label>Confirm Password</FormControl.Label>
                <Input onChangeText={text => handleInputChange(text, setPasswordConfirm)} value={passwordConfirm} secureTextEntry={true} autoCompleteType="password" textContentType="password" placeholder="Confirm Password" />
              </FormControl>
              <PaneActionButton text="Update Password" disabled={!formIsValid || emailSent ? true : false} action={handleReset} />
              {helperText && <HelperText type={formIsValid ? "success" : "error"} text={helperText} />}
              {loading && <LoadingInPane text="Updating Password..." />}
              <View alignItems="center">
                <Link _text={{ fontSize: "lg" }} onPress={() => navigation.push("SignIn")} my={1}>
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
                <Input onChangeText={text => handleInitialEmailChange(text, setEmail)} value={email} autoCompleteType="email" textContentType="emailAddress" placeholder="Enter Email" />
              </FormControl>
              <PaneActionButton text="Confirm Email" disabled={!formIsValid || emailSent ? true : false} action={handleSendEmailConfirmation} />
              {helperText && <HelperText type={formIsValid ? "success" : "error"} text={helperText} />}
              {loading && <LoadingInPane text="SendingEmail..." />}
              <View alignItems="center">
                <Link _text={{ fontSize: "lg" }} onPress={() => navigation.push("SignIn")} my={1}>
                  Back To Sign In
                </Link>
              </View>
            </VStack>
          </Pane>
        )}
      </View>

      {/* <ScreenActionButton text={verifyPassword ? `Update Password` : "Confirm Email"} disabled={!formIsValid || emailSent ? true : false} action={verifyPassword ? handleReset : handleSendEmailConfirmation} /> */}
    </ScreenContainer>
  );
};

export default ForgotPassword;
