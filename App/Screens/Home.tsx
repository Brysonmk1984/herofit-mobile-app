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
            openModal("feedback");
          }}
        >
          Open Modal
        </Button>

        <Button
          onPress={() => {
            openModal("patchUpdate");
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

  return (
    <ScreenContainer screenName={route.name}>
      {renderHeroDetails()}
      <CharacterModal id="levelUp" modalOpen={state.modalQueue[0] === "levelUp"} speech="OOO You have been working out!">
        <ActionHeader type="Success" text="You Did it!" />
        <BodyContent>
          <Text>THE CONTENT</Text>
        </BodyContent>
      </CharacterModal>

      <BasicModal id="patchUpdate" modalOpen={state.modalQueue[0] === "patchUpdate"} title="BIG SURPRISE!">
        <BodyContent>
          <Text>THE CONTENT</Text>
        </BodyContent>
      </BasicModal>

      <FeedbackModal id="feedback" modalOpen={state.modalQueue[0] === "feedback"} title="Quick Question">
        <FeedbackChoiceForm id="feedback" title={"How would you feel if you could never play HeroFit again?"} postSubmitAction={() => formActionHappens("feedback")} />
      </FeedbackModal>

      <Button onPress={() => navigation.toggleDrawer()}>Drawer</Button>
    </ScreenContainer>
  );
};

export default Home;
