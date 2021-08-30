import React, { useContext, useEffect, useState, createRef } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, ScrollView } from "native-base";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import debugErrors from "../common/debugErrors";
import { GlobalStateContext } from "../store";
import { Item } from "../common/types";
import { MainDrawerProps } from "../common/types-navigator";
import { CharacterModal, FeedbackModal, BasicModal } from "../Components/Modal/Modals";
import { ActionHeader, BodyContent } from "../Components/Modal/Content";
import { openModal, closeModal } from "../common/modalController";

const Home: React.FC<MainDrawerProps<"Home">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
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
            openModal("feedback", dispatch);
          }}
        >
          Open Modal
        </Button>

        <Button
          onPress={() => {
            openModal("patchUpdate", dispatch);
          }}
        >
          Open Modal
        </Button>
      </View>
    );
  }

  useEffect(() => {
    console.log("MQ=", state.modalQueue);
  }, [state.modalQueue]);

  useEffect(() => {
    setTimeout(() => {
      openModal("levelUp", dispatch);
    }, 6000);
  }, []);

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

      <FeedbackModal id="feedback" modalOpen={state.modalQueue[0] === "feedback"} title="Your feedback is welcome">
        <BodyContent>
          <Text>Feedback content</Text>
        </BodyContent>
      </FeedbackModal>

      <Button onPress={() => navigation.toggleDrawer()}>Drawer</Button>
    </ScreenContainer>
  );
};

export default Home;
