import React, { useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { View, Text, VStack, FormControl, Input, Link, Button, Center, Divider, Box } from "native-base";
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
import KeyboardScrollView from "../../Components/KeyboardScrollView";

const ForgotPassword = ({ navigation, route }: AuthStackProps<"ForgotPassword">) => {
  const { addToast } = useGlobalToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [helperText, setHelperText] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  // The URL param that's emailed to user and redirected through website
  // Also used to control whether form is in state 1 or 2
  const [verifyPassword, setVerifyPassword] = useState(null);
  const [resendSent, setResendSent] = useState(false);

  async function handleReset() {
    try {
      if (!formIsValid) {
        throw new Error("Please complete the form.");
      }
      setLoading(true);
      setHelperText(null);
      setFormIsValid(false);
      await resetPassword({ email: email.trim(), token: verifyPassword, password: password.trim() });
      setLoading(false);
      addToast("success", "Password has been updated!");
      setTimeout(() => {
        navigation.push("SignIn");
      }, 2000);
    } catch (error) {
      debugErrors(error);
      setLoading(false);
      addToast("error", `${error.message}`);
    }
  }

  async function handleSendEmailConfirmation(sendAgain = false) {
    if (!sendAgain && emailSent) {
      return;
    } else if (sendAgain) {
      setResendSent(false);
    }
    setEmailSent(true);
    Keyboard.dismiss();
    try {
      if (!formIsValid) {
        throw new Error("Please complete the form.");
      }
      await sendPasswordResetEmailVerification({ email: email.trim(), isMobileApp: true });
      setLoading(false);
      addToast("success", "Please check your email to verify account. Check your spam folder if the message is not in your inbox.", 5000);
    } catch (error) {
      console.log("nope", error);
      setEmailSent(false);
      setLoading(false);

      if (error.meta === "No matching email.") {
        error.message = "Email is not on record.";
      }
      debugErrors(error);
      addToast("error", `${error.message}`);
    }
  }

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
      <KeyboardScrollView>
        <Header text="Forgot Password" />
        {verifyPassword ? (
          // Show Password inputs
          <Pane>
            <VStack space={6} mt={5}>
              <FormControl isDisabled isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
                <FormControl.Label>Email</FormControl.Label>
                <Input onChangeText={text => handleInputChange(text, setEmail)} value={email} autoCompleteType="email" textContentType="emailAddress" placeholder="Enter Email" autoCapitalize="none" />
              </FormControl>
              <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
                <FormControl.Label>New Password</FormControl.Label>
                <Input onChangeText={text => handleInputChange(text, setPassword)} value={password} secureTextEntry={true} autoCompleteType="password" textContentType="password" placeholder="Enter Password" autoCapitalize="none" />
              </FormControl>
              <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
                <FormControl.Label>Confirm Password</FormControl.Label>
                <Input onChangeText={text => handleInputChange(text, setPasswordConfirm)} value={passwordConfirm} secureTextEntry={true} autoCompleteType="password" textContentType="password" placeholder="Confirm Password" autoCapitalize="none" />
              </FormControl>
              <PaneActionButton text="Update Password" disabled={!formIsValid ? true : false} action={handleReset} />
              {helperText && <HelperText type={formIsValid ? "success" : "error"} text={helperText} />}
              {loading && <LoadingInPane text="Updating Password..." />}
              <View alignItems="center">
                <Link _text={{ fontSize: "lg" }} onPress={() => navigation.push("SignIn")} my={1}>
                  Back to Sign in
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
                <Input onChangeText={text => handleInitialEmailChange(text, setEmail)} value={email} autoCompleteType="email" textContentType="emailAddress" placeholder="Enter Email" autoCapitalize="none" />
              </FormControl>
              <PaneActionButton disabled={emailSent} text="Confirm Email" disabled={emailSent ? true : false} action={handleSendEmailConfirmation} />
              {helperText && <HelperText type={formIsValid ? "success" : "error"} text={helperText} />}
              {loading && <LoadingInPane text="SendingEmail..." />}
              <View alignItems="center">
                {emailSent && resendSent && (
                  <>
                    <Box pb={3}>
                      <Link _text={{ fontSize: "lg" }} onPress={() => handleSendEmailConfirmation(true)} my={1}>
                        Resend Confirmation Email
                      </Link>
                    </Box>
                    <Divider mb={2} />
                  </>
                )}

                <Link _text={{ fontSize: "lg" }} onPress={() => navigation.push("SignIn")} my={1}>
                  Back to Sign in
                </Link>
              </View>
            </VStack>
          </Pane>
        )}
      </KeyboardScrollView>
    </ScreenContainer>
  );
};

export default ForgotPassword;
