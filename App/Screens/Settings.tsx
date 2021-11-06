import React, { useContext } from "react";
import { Alert } from "react-native";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, Toast } from "native-base";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import { clearJwtInLocalStorage } from "../common/jwtModule";
import debugErrors, { createAppError } from "../common/debugErrors";
import { Hero, User } from "../common/types";
import { deleteAccount } from "../api/account";
import { GlobalStateContext } from "../store";
import { MainDrawerProps } from "../common/types-navigator";
import { isExistingHero } from "../common/typeGuards";
import { DrawerIndicator } from "../Components/CustomComponents";
import { clearLs } from "../common/helperFunctions";
import useGlobalToast from "../common/hooks/useGlobalToast";

const Settings: React.FC<MainDrawerProps<"Settings">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { addToast } = useGlobalToast();
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
          addToast("success", "Account has been deleted. We hope to see you again!");
          dispatch({ type: "SET ISSIGNEDIN", payload: { isSignedIn: false } });
          console.log("NOWW resetting defaults");

          setTimeout(() => {
            dispatch({ type: "RESET DEFAULTS" });
          }, 2000);
        })
        .catch(error => {
          debugErrors(error, user, dispatch);
          addToast("error", `Unable to delete account- ${error.message}`);
        });
    } else {
      const error = createAppError("No ID associated with Hero", "Probably hasn't saved account yet", state.user);

      debugErrors(error, user, dispatch);
      addToast("error", "Problem Deleting Hero, please try again later");
    }
  }

  function signOut(): void {
    clearJwtInLocalStorage();
    dispatch({ type: "SET ISSIGNEDIN", payload: { isSignedIn: false } });
  }

  function myCB() {
    console.log("works");
  }

  return (
    <ScreenContainer screenName={route.name}>
      <Button onPress={signOut}>Delete JWT</Button>
      <Button onPress={() => clearLs("herofit-stravaActivities")}>Delete LS Activities</Button>
      <Button variant="caution" onPress={() => createDeleteAlert()}>
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
      <Button onPress={() => addToast("success", "message")}>BUTTON</Button>
      <DrawerIndicator />
    </ScreenContainer>
  );
};

export default Settings;
