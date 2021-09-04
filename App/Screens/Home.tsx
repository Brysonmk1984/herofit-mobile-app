import React, { useContext, useEffect, useState, createRef } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, ScrollView } from "native-base";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import debugErrors from "../common/debugErrors";
import { GlobalStateContext } from "../store";
import { Item } from "../common/types";
import { MainDrawerProps } from "../common/types-navigator";
import { CharacterModal, FeedbackModal, BasicModal } from "../Components/Modal/Modals";
import { ActionHeader, BodyContent } from "../Components/Modal/Content";
import useModal from "../common/hooks/useModal";
import FeedbackChoiceForm from "../Components/Forms/FeedbackChoiceForm";

const Home: React.FC<MainDrawerProps<"Home">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const { name, status, health, maxHealth, activityXP, battleXP, photonTokens, goToBattle, equipped } = state.hero;

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
        <Button
          onPress={() => {
            openModal("confirmEmail");
          }}
        >
          Open Modal
        </Button>

        <Button
          onPress={() => {
            openModal("levelUp");
          }}
        >
          Open Modal
        </Button>
      </View>
    );
  }

  function feedbackSubmitted() {
    console.log("SUBMITTED");
  }

  function formActionHappens(id) {
    console.log("FA HAPPENED!");
  }

  useEffect(() => {
    if (state.userStatus === "new") {
      setTimeout(() => {
        openModal("SignUp");
      }, 2000);
    } else if (state.userStatus === "unconfirmed") {
      setTimeout(() => {
        openModal("ChooseActivityEntry");
      }, 2000);
    }
  }, []);

  return (
    <ScreenContainer screenName={route.name}>
      {renderHeroDetails()}
      {/* SIGNUP MODAL */}
      <CharacterModal id="SignUp" modalOpen={state.modalQueue[0] === "SignUp"} speech="What's this? a new student? hmmm... I'll consider it. Tell me about yourself, drifter." modalAction={() => navigation.push("Register")}>
        <ActionHeader type="warning" text="Sign Up to Save your Hero" />
        <BodyContent>
          <View p={3} backgroundColor="base.background">
            <Heading borderBottomWidth={2} borderColor="primary.900" textAlign="center">
              <Text fontSize="2xl" fontFamily="heading">
                The Hero's Initiation
              </Text>
            </Heading>
            <Box pl={10}>
              <Text strikeThrough={true} opacity={0.5}>
                1. Choose your Hero
              </Text>
              <Text>2. Create a HeroFit Account</Text>
              <Text>3. Choose Strava or Manual Mode</Text>
            </Box>
          </View>
        </BodyContent>
      </CharacterModal>

      {/* CONFIRM EMAIL MODAL */}
      <BasicModal id="confirmEmail" modalOpen={state.modalQueue[0] === "confirmEmail"} title="Please Confirm Your Email!">
        <ActionHeader type="warning" text="Confirm Email & Receive +5 QP" />
        <BodyContent>
          <View p={3} backgroundColor="base.background">
            <Text fontWeight="bold">
              Please click the link in your email inbox at: <Text>{state.user.email}</Text>
            </Text>
            <Text>Be sure to check the spam folder if it's not there.</Text>
          </View>
        </BodyContent>
      </BasicModal>

      {/* ACTIVITY ENTRY MODAL */}
      <CharacterModal id="ChooseActivityEntry" modalOpen={state.modalQueue[0] === "ChooseActivityEntry"} speech="What's this? a new student? hmmm... I'll consider it. Tell me about yourself, drifter." modalAction={() => navigation.push("Register")}>
        <ActionHeader type="warning" text="Sign Up to Save your Hero" />
        <BodyContent>
          <View p={3} backgroundColor="base.background">
            <Heading borderBottomWidth={2} borderColor="primary.900" textAlign="center">
              <Text fontSize="2xl" fontFamily="heading">
                The Hero's Initiation
              </Text>
            </Heading>
            <Box pl={10}>
              <Text strikeThrough={true} opacity={0.5}>
                1. Choose your Hero
              </Text>
              <Text strikeThrough={true} opacity={0.5}>
                2. Create a HeroFit Account
              </Text>
              <Text>3. Choose Strava or Manual Mode</Text>
            </Box>
          </View>
        </BodyContent>
      </CharacterModal>

      {/* <BasicModal id="patchUpdate" modalOpen={state.modalQueue[0] === "patchUpdate"} title="BIG SURPRISE!">
        <BodyContent>
          <Text>THE CONTENT</Text>
        </BodyContent>
      </BasicModal> */}

      {/* <FeedbackModal id="feedback" modalOpen={state.modalQueue[0] === "feedback"} title="Quick Question">
        <FeedbackChoiceForm id="feedback" title={"How would you feel if you could never play HeroFit again?"} postSubmitAction={() => formActionHappens("feedback")} />
      </FeedbackModal> */}

      <Button onPress={() => navigation.toggleDrawer()}>Drawer</Button>
    </ScreenContainer>
  );
};

export default Home;
