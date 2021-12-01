import React, { useContext, useEffect, useState } from "react";
import { View, Text, VStack, FormControl, Input, Link, Spinner, HStack, Center, Button } from "native-base";
import { login } from "../../api/authentication";
import { GlobalStateContext } from "../../store";
import debugErrors from "../../common/debugErrors";
import fetchInitialData from "../../common/fetchInitialData";
import { Header, ScreenContainer, ScreenActionButton, Pane, HelperText, LoadingInPane } from "../../Components/CustomComponents";
import { useDebouncedCallback } from "use-debounce";
import { AuthStackProps } from "../../common/types-navigator";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import * as WebBrowser from "expo-web-browser";
import PaneSupportText from "../../Components/PaneSupportText";
import PaneActionButton from "../../Components/PaneActionButton";

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

  async function handleSignIn() {
    setLoading(true);
    setHelperText(null);

    try {
      if (!formIsValid) {
        throw new Error("Please complete the form.");
      }

      const { user, tokenObject } = await login({ email, password, isMobileApp: true });
      setSuccess(true);

      // User hasn't confirmed email yet
      if (!user.active) {
        addToast("caution", "Please Confirm your Email by Clicking the link in the message sent after registration.");
        dispatch({ type: "SET USER", payload: { user, isSignedIn: false } });
        return setLoading(false);
      }

      await fetchInitialData(null, dispatch, state, user.email);
      setLoading(false);
    } catch (error) {
      let message = debugErrors(error);

      if (Array.isArray(error.debug)) {
        if (error.debug[0].msg === "Couldn't find a user with that email." || error.debug[0].msg === "Incorrect password, please try again.") {
          message = error.debug[0].msg;
          // Force Users from Back before the new login system was built (JUNE 2020) to update via web login.
        } else if (error.debug[0].oldUserMigration) {
          setShowLegacyLink(true);
        }
      }

      setLoading(false);
      addToast("error", message);
    }
  }

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

  useEffect(() => {
    let disableButtonTimeout;
    if (showLegacyLink) {
      disableButtonTimeout = setTimeout(() => {
        setShowLegacyLink(false);
      }, 20000);
    }

    return () => clearTimeout(disableButtonTimeout);
  }, [showLegacyLink]);

  // TODO : need to cleanup ASYNC tasks
  useEffect(() => {}, []);

  return (
    <ScreenContainer screenName={route.name}>
      <View>
        <Header text="Sign In" />
        <Pane>
          <VStack space={6} mt={5}>
            <FormControl isRequired isInvalid={helperText === "Must be valid email address" ? true : false}>
              <Input onChangeText={text => handleInputChange(text, setEmail)} value={email} placeholder="Email" shadow={1} />
            </FormControl>
            <FormControl isRequired isInvalid={helperText === "Password must be at least 8 characters" ? true : false}>
              <Input
                onChangeText={text => handleInputChange(text, setPassword)}
                value={password}
                secureTextEntry={true}
                autoCompleteType="password"
                textContentType="password"
                placeholder="Password"
                onSubmitEditing={() =>
                  setTimeout(() => {
                    handleSignIn(), 1000;
                  })
                }
              />
            </FormControl>
            <PaneActionButton text="Let's Go!" disabled={loading || showLegacyLink ? true : false} action={handleSignIn} />
            {loading ? (
              <LoadingInPane text="Signing In..." />
            ) : (
              <>
                {helperText && <HelperText type={formIsValid ? "success" : "error"} text={helperText} />}

                {showLegacyLink ? (
                  <Center mt={2}>
                    <PaneSupportText iconName="caution" iconColor="base.caution" text={"Must Verify Account on HeroFit.io"}>
                      We have upgraded our login system and because you have a legacy account, you must verify your account from our website.
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
      </View>
    </ScreenContainer>
  );
};

export default SignIn;
