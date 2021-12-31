import React, { useContext, useEffect, useState, useReducer, createRef } from "react";
import { StyleSheet } from "react-native";
import { ScrollView, NativeBaseProvider, Box, View, Text, Heading, VStack, FormControl, Input, Checkbox, Link, Button, Icon, IconButton, HStack, Divider, Center, Switch, Select, CheckIcon } from "native-base";
import { register } from "../../api/authentication";
import { insertAvatar } from "../../api/avatar";
import { GlobalStateContext } from "../../store";
import debugErrors from "../../common/debugErrors";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { Header, ScreenActionButton, Pane, HelperText, LoadingInPane } from "../../Components/CustomComponents";
import { AuthStackProps } from "../../common/types-navigator";
import { User } from "../../common/types";
import { instantiateUserTotals } from "../../api/user";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import PaneActionButton from "../../Components/PaneActionButton";
import KeyboardScrollView from "../../Components/KeyboardScrollView";

// prettier-ignore
interface FormState { email: string; firstName: string; username: string; password: string; emailMarketingOptIn: boolean; helperText: string; formIsValid: boolean; loading: boolean, isMetric : boolean, foundOutBy : string, referredBy : string | null }
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
interface SetLoadingAction {
  type: "SET LOADING";
  loading: boolean;
}
interface SetHelperTextAction {
  type: "SET HELPER TEXT";
  helperText: string | null;
}
interface SetIsMetric {
  type: "SET IS_METRIC";
  isMetric: boolean;
}
interface SetfoundOutBy {
  type: "SET FOUND OUT BY";
  foundOutBy: string;
}
interface SetReferredBy {
  type: "SET REFERRED BY";
  referredBy: string;
}
type FormAction = EmailInputAction | FirstNameInputAction | UsernameInputAction | PasswordInputAction | EmailMarketingOptInToggleAction | SetLoadingAction | SetHelperTextAction | SetIsMetric | SetFoundOutBy | SetReferredBy;

function formReducer(state: FormState, action: FormAction): FormState {
  function checkValidForm({ email, username, password, foundOutBy }) {
    if (email.includes("@")) {
      if (username.length) {
        if (password.length >= 8) {
          if (foundOutBy) {
            return { formIsValid: true, helperText: "Looks Good!" };
          } else {
            return { formIsValid: false, helperText: "How did you hear about us?" };
          }
        } else {
          return { formIsValid: false, helperText: "Password must be at least 8 characters" };
        }
      } else {
        return { formIsValid: false, helperText: "Username is required" };
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
      return { ...state, emailMarketingOptIn: action.emailMarketingOptIn };
    }
    case "SET LOADING": {
      return { ...state, loading: action.loading };
    }
    case "SET HELPER TEXT": {
      return { ...state, helperText: action.helperText };
    }
    case "SET IS_METRIC": {
      return { ...state, isMetric: action.isMetric };
    }
    case "SET FOUND OUT BY": {
      const updatedState = { ...state, foundOutBy: action.foundOutBy };
      const { formIsValid, helperText } = checkValidForm(updatedState);
      return { ...updatedState, formIsValid, helperText };
    }
    case "SET REFERRED BY": {
      return { ...state, referredBy: action.referredBy };
    }
    default:
      throw new Error("No Matching Action");
  }
}

const Register = ({ navigation, route }: AuthStackProps<"Register">) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { addToast } = useGlobalToast();
  const initialFormState: Omit<FormState, "loading"> = {
    email: "",
    firstName: "",
    username: "",
    password: "",
    emailMarketingOptIn: true,
    helperText: "",
    formIsValid: false,
    isMetric: false,
    foundOutBy: null,
    referredBy: null,
  };
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);

  // first time sign up, need to insert avinsertAvatarIntoDb
  async function handlePostRegister(user: User) {
    dispatch({ type: "SET USER", payload: { user } });

    try {
      const { avatar, avatarId, awardedItemMessage } = await insertAvatar({ avatar: state.hero, email: user.email, userId: user.id });

      await instantiateUserTotals({ email: user.email, avatarId: avatarId });

      dispatch({ type: "SET HERO", payload: { hero: Object.assign(state.hero, avatar) } });
      formDispatch({ type: "SET LOADING", loading: false });
      // Display welcome message
      awardedItemMessage ? addToast("success", `Welcome to HeroFit! ${awardedItemMessage}`, 5000) : addToast("success", `Welcome to HeroFit!`, 3000);
      // changing isSignedIn will unmount the component; must be last
      dispatch({ type: "SET ISSIGNEDIN", payload: { isSignedIn: true, initialHomescreenLoad: null } });
    } catch (error) {
      // Error getting Avatar, should only happen if DB connection issues
      debugErrors(error, user);
      addToast("error", `${error.status}: ${error.message}`);
      formDispatch({ type: "SET LOADING", loading: false });
      formDispatch({ type: "SET HELPER TEXT", helperText: null });
    }
  }

  async function handleSignUp() {
    try {
      const { email, firstName, username: username, password, emailMarketingOptIn, formIsValid, isMetric, foundOutBy, referredBy } = formState;
      if (!formIsValid) {
        throw new Error("Please complete the form.");
      }

      formDispatch({ type: "SET LOADING", loading: true });

      const data = await register({ email: email.trim(), firstName, username, password: password.trim(), emailMarketingOptIn, isMetric, foundOutBy, referredBy, isMobileApp: true });
      const { user } = data;
      dispatch({ type: "SET USER STATUS", payload: { userStatus: "unconfirmed" } });

      handlePostRegister(user);
    } catch (error) {
      formDispatch({ type: "SET LOADING", loading: false });
      if (error.debug) {
        addToast("error", error.debug[0]);
      } else {
        addToast("error", error.toString());
      }
      debugErrors(error);
    }
  }

  // Only used to reset referredBy if it was filled in but user selected a different option for foundOutBy afterwards
  useEffect(() => {
    if (formState.foundOutBy !== "From a Friend") {
      if (formState.referredBy) {
        formDispatch({ type: "SET REFERRED BY", payload: { referredBy: null } });
      }
    }
  }, [formState.foundOutBy]);

  return (
    <ScreenContainer screenName={route.name}>
      <KeyboardScrollView extraScroll={300}>
        <Header text="Sign Up" mb={0} />

        <Pane mt={-5} mb={3}>
          <VStack space={2} mt={0}>
            <FormControl isRequired isInvalid={formState.helperText === "Must be valid email address" ? true : false}>
              <Input onChangeText={email => formDispatch({ type: "EMAIL INPUT", email })} value={formState.email} placeholder="Email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </FormControl>
            <FormControl isRequired isInvalid={formState.helperText === "Username is required" ? true : false}>
              <Input onChangeText={username => formDispatch({ type: "USERNAME INPUT", username })} value={formState.username} placeholder="Username" autoCapitalize="none" />
            </FormControl>
            <FormControl isRequired isInvalid={formState.helperText === "Password must be at least 8 characters" ? true : false}>
              <Input onChangeText={password => formDispatch({ type: "PASSWORD INPUT", password })} value={formState.password} secureTextEntry={true} autoCompleteType="password" textContentType="password" placeholder="Password" autoCapitalize="none" autoCorrect={false} />
            </FormControl>
            <FormControl>
              <Input onChangeText={firstName => formDispatch({ type: "FIRST NAME INPUT", firstName })} value={formState.firstName} placeholder="First Name (Optional)" autoCapitalize="none" />
            </FormControl>
            <FormControl alignItems="center" p={2} bgColor="primary.100">
              <FormControl.Label fontSize="lg">Kilometers or Miles?</FormControl.Label>
              <HStack alignItems="center" alignSelf="center">
                <Text fontSize="lg" fontFamily="heading">
                  METRIC
                </Text>
                <Switch isChecked={!formState.isMetric} onToggle={(isMetric: boolean) => formDispatch({ type: "SET IS_METRIC", isMetric: !isMetric })} mx={5} size="lg" offThumbColor="blue.700" onThumbColor="red.600" />
                <Text fontSize="lg" fontFamily="heading">
                  MURICAN
                </Text>
              </HStack>
            </FormControl>
            <Box bgColor="primary.100" px={2} pb={2}>
              <FormControl my={3} isRequired>
                <Select
                  placeholder="How did you hear about HeroFit?"
                  selectedValue={formState.foundOutBy}
                  accessibilityLabel="How'd you hear about us?"
                  onValueChange={foundOutBy => {
                    formDispatch({ type: "SET FOUND OUT BY", foundOutBy });
                  }}
                  _selectedItem={{
                    bgColor: "success.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  _item={{
                    bgColor: "primary.100",
                    width: "96%",
                    alignSelf: "center",
                  }}
                  mt={1}
                >
                  <Select.Item label="From a Friend" value="From a Friend" my={1} />
                  <Select.Item label="Search Engine" value="Search Engine" my={1} />
                  <Select.Item label="Saw a Reddit Post" value="Reddit" my={1} />
                  <Select.Item label="Found in the App Store" value="App Store" my={1} />
                  <Select.Item label="Found in the Play Store" value="Play Store" my={1} />
                  <Select.Item label="Saw a Flier" value="Flier" my={1} />
                  <Select.Item label="Other" value="Other" my={1} />
                </Select>
              </FormControl>
              {formState.foundOutBy === "From a Friend" && (
                <FormControl>
                  <FormControl.Label>We want to reward your friend!</FormControl.Label>
                  <Input onChangeText={referredBy => formDispatch({ type: "SET REFERRED BY", referredBy })} value={formState.referredBy} placeholder="Enter Friend's Email or Hero Name" autoCapitalize="none" />
                </FormControl>
              )}
            </Box>
            <Box bgColor="primary.100" px={2} pt={2}>
              <FormControl>
                <HStack my={2} px={0}>
                  <Checkbox colorScheme="success" value={formState.emailMarketingOptIn.toString()} onChange={emailMarketingOptIn => formDispatch({ type: "EMAIL MARKETING OPT IN TOGGLE", emailMarketingOptIn })} accessibilityLabel="This is an email optin checkbox" defaultIsChecked />
                  <Text px={5} mt={-1}>
                    Receive content-related emails no more than once per month
                  </Text>
                </HStack>
              </FormControl>
            </Box>
            <PaneActionButton text="Let's Go!" action={handleSignUp} />
            {/* Show Loading indicator or Helper Text */}
            {formState.loading ? <LoadingInPane text="Creating Account..." /> : formState.helperText ? <HelperText text={formState.helperText} type={formState.formIsValid ? "success" : "error"} /> : null}
          </VStack>
        </Pane>
      </KeyboardScrollView>
    </ScreenContainer>
  );
};

export default Register;
