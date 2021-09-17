import React, { useContext, useEffect, useState, createRef } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, ScrollView, Radio } from "native-base";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import debugErrors from "../../common/debugErrors";
import { GlobalStateContext } from "../../store";
import { Item, User } from "../../common/types";
import { MainDrawerProps } from "../../common/types-navigator";
import useModal from "../../common/hooks/useModal";
import { getUser } from "../../api/user";
import { updateAlerts } from "../../common/alerts";

//import updateDataSrcId from "./AuthFinalSteps/AuthFlow";

import { createManualDataSrcId } from "../../api/authentication";
import { ChooseActivityEntry, SignupToSave, SignupFinished, ConfirmEmail, FeedbackChoice } from "./Modals/Modals";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { DrawerIndicator } from "../../Components/DrawerIndicator";
import Background from "./Modals/Components/Background";
import BottomDrawer from "./Modals/Components/BottomDrawer";

const Home: React.FC<MainDrawerProps<"Home">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal } = useModal();
  const { name, status, health, maxHealth, activityXP, battleXP, photonTokens, goToBattle, equipped, qp } = state.hero;
  const attributesForBottomConsole = (({ power, recovery, armor, fire, earth, water, air, aether }) => ({ power, recovery, armor, fire, earth, water, air, aether }))(state.hero);
  console.log("SH", attributesForBottomConsole);
  function renderItem({ item }: Item) {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  }

  function renderHeroDetails() {
    return (
      <View>
        <Text>Hero Name: {name}</Text>
        <Text>Status: {status}</Text>
        <Text>
          Health: {health} / {maxHealth}
        </Text>
        <Text>XP: {activityXP + battleXP}</Text>
        <Text>PT: {photonTokens}</Text>
        <Text>Awaiting Battle: {String(goToBattle)}</Text>
        <FlatList data={equipped} renderItem={renderItem} keyExtractor={(item, i) => i.toString()} />
      </View>
    );
  }

  function formActionHappens(data) {
    console.log("FORM ACTION FROM HOME!!!", data);
  }

  async function handleEmailConfirmed() {
    try {
      // * First time the user is assigned
      const { user } = await getUser({ email: state.user.email });
      console.log("UPDATED USER!", user);

      if (user.active) {
        dispatch({ type: "SET USER", payload: { user, isSignedIn: true } });
        dispatch({ type: "SET HERO", payload: { hero: { ...state.hero, qp: qp + 5 } } });
        dispatch({ type: "SET USER STATUS", payload: { userStatus: user.active ? "active" : "unconfirmed" } });
        setTimeout(() => {
          openModal("ChooseActivityEntry");
        }, 2000);
        // Open next modal
      } else {
        updateAlerts([{ type: "error", message: "Email Has not been confirmed; please click the link in your inbox." }], state, dispatch);
      }
    } catch (error) {
      debugErrors(error, state.user);
    }
  }

  useEffect(() => {
    //console.log("SU", state.userStatus, state.user);
    if (state.userStatus === "new") {
      openModal("SignupToSave", 2000);
    } else if (state.userStatus === "unconfirmed") {
      openModal("ConfirmEmail", 2000);
    } else if (state.user === null || !state.user?.dataSrcId) {
      openModal("ChooseActivityEntry", 2000);
    }
  }, [state.userStatus, state.user, state.user?.dataSrcId]);

  return (
    <ScreenContainer screenName={route.name}>
      <Background />
      {renderHeroDetails()}
      <DrawerIndicator action={() => navigation.toggleDrawer()} />
      <BottomDrawer attributes={attributesForBottomConsole} />

      {/* MODALS */}
      <SignupToSave id="SignupToSave" modalAction={() => navigation.push("Register")} />
      <ConfirmEmail id="ConfirmEmail" modalAction={handleEmailConfirmed} />
      <ChooseActivityEntry id="ChooseActivityEntry" />
      <FeedbackChoice id="FeedbackChoice" modalAction={formActionHappens} />
      <SignupFinished id="SignupFinished" />
    </ScreenContainer>
  );
};

export default Home;
