import React, { useContext } from "react";
import { Button } from "native-base";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import debugErrors, { createAppError } from "../common/debugErrors";
import { User } from "../common/types";
import { deleteAccount, disconnectStrava } from "../api/account";
import { GlobalStateContext } from "../store";
import { MainStackProps } from "../common/types-navigator";
import { isExistingHero } from "../common/typeGuards";
import { Header, Pane, Subheader } from "../Components/CustomComponents";
import { checkDataSrcType, clearLs, createAlert } from "../common/helperFunctions";
import useGlobalToast from "../common/hooks/useGlobalToast";
import PaneSupportText from "../Components/PaneSupportText";
import { ScrollView } from "react-native-gesture-handler";
import { createManualDataSrcId } from "../api/authentication";
import useStravaConnect from "../common/hooks/useStravaConnect";
import StravaConnectButton from "../Components/Buttons/StravaConnectButton";
import * as WebBrowser from "expo-web-browser";

const Settings: React.FC<MainStackProps<"Settings">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { addToast } = useGlobalToast();
  const { hero, user } = state;
  const isStravaUser = "strava" === checkDataSrcType(user.dataSrcId);

  //const { clientId, request, promptAsync } = useStravaConnect();
  const { clientId, request, promptAsync, stravaSuccess, helperText } = useStravaConnect();

  function handleStravaDisconnection() {
    async function disconnect() {
      try {
        // First Disconnect
        await disconnectStrava({ email: user.email });
        // Then add new hf- datasrcid
        const { user: updatedUser } = await createManualDataSrcId({ email: user.email });
        dispatch({ type: "SET USER", payload: { user: updatedUser, isSignedIn: true } });
        addToast("success", `Your Strava credentials have been removed from HeroFit`);
        clearLs("herofit-stravaActivities");
      } catch (error) {
        debugErrors(error, user);
        addToast("error", `Unable to delete account- ${error.message}`);
      }
    }
    createAlert("Disconnect Strava Account", "Your activities wont sync if you disconnect", disconnect);
  }

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

  return (
    <ScreenContainer screenName={route.name}>
      <Header text="Settings" />
      <ScrollView>
        <Pane mt={5} mb={10}>
          <Subheader fontSize="xl" text="Strava Settings" />
          <PaneSupportText iconName="caution" iconColor="base.caution" text="Connect or Disconnect Strava Account.">
            Disconnecting Strava won't impact your existing activities or Hero. This is useful if you want to assign your Strava account to another Hero.
          </PaneSupportText>
          {isStravaUser ? (
            <Button bgColor="base.strava" _text={{ fontFamily: "heading", fontSize: "2xl" }} mt={5} onPress={() => handleStravaDisconnection()}>
              Disconnect Strava
            </Button>
          ) : (
            // TODO: Need to figure out why strava connect keeps crashing from settings page
            <StravaConnectButton disable={true} promptAsync={promptAsync} />
            // <StravaConnectButton disable={!request || !clientId} promptAsync={promptAsync} />
          )}
        </Pane>
        <Pane mb={10}>
          <Subheader fontSize="xl" text="Delete activities cached on device" />
          <Button _text={{ fontFamily: "heading", fontSize: "2xl" }} mt={5} onPress={() => clearLs("herofit-stravaActivities")}>
            Delete Activity Cache
          </Button>
        </Pane>
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
