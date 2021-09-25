import React, { useContext } from "react";
import { Alert } from "react-native";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from "native-base";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import { clearJwtInLocalStorage } from "../common/jwtModule";
import debugErrors, { createAppError } from "../common/debugErrors";
import { Hero, User } from "../common/types";
import { updateAlerts } from "../common/alerts";
import { deleteAccount } from "../api/account";
import { GlobalStateContext } from "../store";
import { MainDrawerProps } from "../common/types-navigator";
import { isExistingHero } from "../common/typeGuards";

const Settings: React.FC<MainDrawerProps<"Settings">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const hero = state.hero;

  const createDeleteAlert = () => {
    return Alert.alert(
      "Delete Account",
      "WARNING: This is non-reversible!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleDeleteAccount() },
      ],
      { cancelable: true },
    );
  };

  function handleDeleteAccount() {
    // TODO: Delete immediately after account creation doesnt work, hero doesn't have ID
    const user: User = state.user;
    if (isExistingHero(hero)) {
      deleteAccount({ username: user.username, avatarID: hero.id, email: user.email })
        .then(async data => {
          updateAlerts([{ type: "success", message: "Account has been deleted. We hope to see you again sometime." }], state, dispatch);
          dispatch({ type: "RESET DEFAULTS" });

          setTimeout(() => {
            return navigation.navigate("Auth", { screen: "SignIn" });
          }, 3000);
        })
        .catch(error => {
          debugErrors(error, user, dispatch);
          updateAlerts([{ type: "error", message: `Unable to delete account- ${error.message}` }], state, dispatch);
        });
    } else {
      const error = createAppError("No ID associated with Hero", "Probably hasn't saved account yet", state.user);

      debugErrors(error, user, dispatch);
      updateAlerts([{ type: "error", message: "Problem Deleting Hero, please try again later" }], state, dispatch);
    }
  }

  function signOut(): void {
    clearJwtInLocalStorage();
    dispatch({ type: "SET ISSIGNEDIN", payload: { isSignedIn: false } });
  }

  function myCB() {
    console.log("works");
  }

  function addAlert() {
    const message = Math.random();
    updateAlerts([{ type: "success", message, confirm: { text: "cake", cb: myCB } }], state, dispatch);
  }

  return (
    <ScreenContainer screenName={route.name}>
      <Button onPress={signOut}>Delete JWT</Button>
      <Button variant="warning" onPress={() => createDeleteAlert()}>
        Delete ACCOUNT
      </Button>
      <Button
        onPress={() => {
          dispatch({ type: "SET USER STATUS", payload: { userStatus: "new" } });
          dispatch({ type: "SET ISSIGNEDIN", payload: { isSignedIn: false } });
          return navigation.navigate("Auth", { screen: "SelectHero" });
        }}
      >
        Select Hero
      </Button>
      <Button variant="secondary" title="Add Alert" onPress={addAlert}>
        Add Alert
      </Button>
    </ScreenContainer>
  );
};

export default Settings;
