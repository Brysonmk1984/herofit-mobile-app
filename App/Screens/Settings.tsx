import React, { useContext } from "react";
import { Button, Text } from "native-base";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import debugErrors, { createAppError } from "../common/debugErrors";
import { User } from "../common/types";
import { deleteAccount, disconnectDataSrc } from "../api/account";
import { GlobalStateContext } from "../store";
import { MainStackProps } from "../common/types-navigator";
import { isExistingHero } from "../common/typeGuards";
import { Header, Pane, Subheader } from "../Components/CustomComponents";
import { checkDataSrcType, clearLs, createAlert } from "../common/helperFunctions";
import useGlobalToast from "../common/hooks/useGlobalToast";
import PaneSupportText from "../Components/PaneSupportText";
import { ScrollView } from "react-native-gesture-handler";
import { createManualDataSrcId } from "../api/authentication";
import { reloadAsync } from "expo-updates";

const Settings: React.FC<MainStackProps<"Settings">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { addToast } = useGlobalToast();
  const { hero, user } = state;
  const isStravaUser = "strava" === checkDataSrcType(user.dataSrcId);

  async function handleDisconnection() {
    try {
      const { user: updatedUser } = await disconnectDataSrc({ email: user.email });
      createAlert("Connecting Data Source", "HeroFit will reload and you can select Data Source settings from the Home Screen", reloadAsync);
    } catch (error) {
      debugErrors(error, user);
      addToast("error", `Unable to delete account- ${error.message}`);
    }
  }

  function handleStravaDisconnection() {
    async function disconnect() {
      try {
        // First Disconnect
        await disconnectDataSrc({ email: user.email });
        // Then add new hf- datasrcid
        const { user: updatedUser } = await createManualDataSrcId({ email: user.email });
        dispatch({ type: "SET USER", payload: { user: updatedUser, isSignedIn: true } });
        addToast("success", `Your Strava credentials have been removed from HeroFit`);
        clearLs("herofit-stravaActivities");
        navigation.navigate("Home", { clearActivities: true });
      } catch (error) {
        debugErrors(error, user);
        addToast("error", `Unable to delete account- ${error.message}`);
      }
    }
    createAlert("Disconnect Strava Account", "Your activities wont sync if you disconnect", disconnect);
  }

  async function handleCacheClear() {
    await clearLs("herofit-stravaActivities");
    addToast("success", `Local activity Data Cleared`);
    //navigation.navigate("Home", { clearActivities: true, fetchStravaManually: isStravaUser ? true : false });
  }

  function handleDeleteAccount() {
    // TODO: Delete immediately after account creation doesnt work, hero doesn't have ID
    const user: User = state.user;
    if (isExistingHero(hero)) {
      deleteAccount({ username: user.username, avatarID: hero.id, email: user.email })
        .then(async data => {
          addToast("success", "Account has been deleted. We hope to see you again!");
          dispatch({ type: "SET ISSIGNEDIN", payload: { isSignedIn: false } });

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

  function deleteAllCache() {
    clearLs("herofit-stravaActivities");
    clearLs("herofit-jwt");
    clearLs("herofit-seenGlobalMessage");
  }

  return (
    <ScreenContainer screenName={route.name}>
      <Header text="Settings" />
      <ScrollView>
        <Pane mt={5} mb={10}>
          <Subheader fontSize="xl" text="Activity Data Settings" />
          <PaneSupportText iconName="caution" iconColor="base.caution" text="Connect or Disconnect Data Source">
            {isStravaUser ? "Disconnecting Strava won't impact your existing activities or Hero. This is useful if you want to assign your Strava account to another Hero." : "Connect Strava to your HeroFit account or set account to Manual Entry Mode"}
          </PaneSupportText>
          {isStravaUser ? (
            <Button bgColor="base.strava" _text={{ fontFamily: "heading", fontSize: "2xl" }} mt={5} onPress={() => handleStravaDisconnection()}>
              Disconnect Strava
            </Button>
          ) : (
            <Button onPress={handleDisconnection}>Connect Data Source</Button>
          )}
        </Pane>
        <Pane mb={10}>
          <Subheader fontSize="xl" text="Delete activities cached on this device" />
          <Text color="primary.700" textAlign="center">
            This won't effect activities already applied to your Hero
          </Text>
          <Button _text={{ fontFamily: "heading", fontSize: "2xl" }} mt={5} onPress={handleCacheClear}>
            Delete Activity Cache
          </Button>
        </Pane>

        {__DEV__ && (
          <Pane mb={10}>
            <Subheader fontSize="xl" text="Delete ALL cache" />
            <Button _text={{ fontFamily: "heading", fontSize: "2xl" }} mt={5} onPress={deleteAllCache}>
              Delete all cache
            </Button>
          </Pane>
        )}

        {__DEV__ && (
          <Pane mb={10}>
            <Subheader fontSize="xl" text="Test Toasts" />
            <Button _text={{ fontFamily: "heading", fontSize: "2xl" }} mt={5} onPress={() => addToast("success", "This was a success very long loa sasd", 2000, 500)}>
              success Toast
            </Button>
            <Button _text={{ fontFamily: "heading", fontSize: "2xl" }} mt={5} onPress={() => addToast("error", "This was a error")}>
              error Toast
            </Button>
            <Button _text={{ fontFamily: "heading", fontSize: "2xl" }} mt={5} onPress={() => addToast("info", "This was a info")}>
              info Toast
            </Button>
            <Button _text={{ fontFamily: "heading", fontSize: "2xl" }} mt={5} onPress={() => addToast("caution", "This was a caution")}>
              caution Toast
            </Button>
          </Pane>
        )}
        <Pane mb={10}>
          <Subheader fontSize="xl" text="Permanently delete your account" />
          <Button variant="caution" onPress={() => createAlert("Delete Account", "WARNING: This is non-reversible!", handleDeleteAccount)} _text={{ fontFamily: "heading", fontSize: "2xl" }}>
            Delete Account
          </Button>
        </Pane>
      </ScrollView>
    </ScreenContainer>
  );
};

export default Settings;
