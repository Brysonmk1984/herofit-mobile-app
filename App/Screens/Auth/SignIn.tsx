import React, { useContext, useEffect, useState } from "react";
import { VStack, FormControl, Input, Link, Center } from "native-base";
import { login } from "../../api/authentication";
import { GlobalStateContext } from "../../store";
import debugErrors from "../../common/debugErrors";
import fetchInitialData from "../../common/fetchInitialData";
import { Header, ScreenContainer, Pane, HelperText, LoadingInPane } from "../../Components/CustomComponents";
import { useDebouncedCallback } from "use-debounce";
import { AuthStackProps } from "../../common/types-navigator";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import PaneSupportText from "../../Components/PaneSupportText";
import PaneActionButton from "../../Components/PaneActionButton";
import { Keyboard, Platform } from "react-native";
import KeyboardScrollView from "../../Components/KeyboardScrollView";

const SignIn = ({ navigation, route }: AuthStackProps<"SignIn">) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [helperText, setHelperText] = useState<string | null>(null);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLegacyLink, setShowLegacyLink] = useState(false);
  const { addToast } = useGlobalToast();

  function _validationCheck() {
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
  }

  async function handleSignIn() {
    setLoading(true);
    setHelperText(null);
    Keyboard.dismiss();
    try {
      if (!formIsValid) {
        setLoading(false);
        _validationCheck();
        return addToast("error", "Please complete the form.");
      }

      const { user, tokenObject } = await login({ email: email.trim(), password: password.trim(), isMobileApp: true });
      setSuccess(true);

      // User hasn't confirmed email yet
      if (!user.active && !user.emailCode) {
        //addToast("caution", "Please Confirm your Email by Clicking the link in the message sent after registration.", 20000);
        dispatch({ type: "SET USER", payload: { user, isSignedIn: false } });
        setLoading(false);
        if (!user.emailCode) {
          return setShowLegacyLink(true);
        }
        return;
      }

      await fetchInitialData(null, dispatch, state, user.email);
      setLoading(false);
    } catch (error) {
      let message = debugErrors(error);

      if (Array.isArray(error.debug)) {
        if (error.debug[0].msg === "Couldn't find a user with that email." || error.debug[0].msg === "Incorrect password, please try again.") {
          message = "Incorrect username or password, please try again.";
          setFormIsValid(true);
        } else if (error.debug[0].oldUserMigration) {
          // Force Users from Back before the new login system was built (JUNE 2020) to update via web login.
          setShowLegacyLink(true);
        }
      }

      setLoading(false);
      addToast("error", message);
    }
  }

  const debounced = useDebouncedCallback(() => {
    _validationCheck();
  }, 500);

  function handleInputChange(text: string, updateFunction: React.Dispatch<React.SetStateAction<string>>) {
    updateFunction(text);
    debounced();
  }

  // useEffect(() => {
  //   let disableButtonTimeout;
  //   if (showLegacyLink) {
  //     disableButtonTimeout = setTimeout(() => {
  //       setShowLegacyLink(false);
  //     }, 20000);
  //   }

  //   return () => clearTimeout(disableButtonTimeout);
  // }, [showLegacyLink]);

  return (
    <ScreenContainer screenName={route.name}>
      <KeyboardScrollView>
        <Header text="Sign In" />

        <Pane>
          <VStack space={6} mt={5}>
            <FormControl isRequired isInvalid={helperText === "Must be valid email address" ? true : false}>
              <Input onChangeText={text => handleInputChange(text, setEmail)} value={email} placeholder="Email" shadow={1} autoCapitalize="none" />
            </FormControl>
            <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
              <Input onChangeText={text => handleInputChange(text, setPassword)} value={password} secureTextEntry={true} autoCapitalize="none" autoCompleteType="password" textContentType="password" placeholder="Password" onSubmitEditing={() => Keyboard.dismiss()} />
            </FormControl>
            <PaneActionButton text="Let's Go!" disabled={loading || showLegacyLink ? true : false} action={handleSignIn} />
            {loading ? (
              <LoadingInPane text="Signing In..." />
            ) : (
              <>
                {helperText && <HelperText type={formIsValid ? "success" : "error"} text={helperText} />}

                {showLegacyLink ? (
                  <Center mt={2}>
                    <PaneSupportText iconName="caution" iconColor="base.caution" text={"Must Verify Email Before Continuing"}>
                      We have upgraded our login system and because you have a legacy account, you must verify your account now.
                    </PaneSupportText>
                    <Link _text={{ fontSize: "3xl" }} onPress={() => navigation.push("ForgotPassword")} mt={1}>
                      Verify Account
                    </Link>
                  </Center>
                ) : (
                  <Center mt={2}>
                    <Link _text={{ fontSize: "lg" }} onPress={() => navigation.push("ForgotPassword")} my={1}>
                      Forgot Password?
                    </Link>
                  </Center>
                )}
              </>
            )}
          </VStack>
        </Pane>
      </KeyboardScrollView>
    </ScreenContainer>
  );
};

export default SignIn;
