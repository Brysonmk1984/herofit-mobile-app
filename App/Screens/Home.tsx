import React, { useContext, useEffect, useState, createRef } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from "native-base";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import debugErrors from "../common/debugErrors";
import { GlobalStateContext } from "../store";
import { Item } from "../common/types";
import { MainDrawerProps } from "../common/types-navigator";
import CharacterModal from "../Components/Modal/CharacterModal";

const Home: React.FC<MainDrawerProps<"Home">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [modalOpen, setModalOpen] = useState(false);
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
        <Button onPress={() => setModalOpen(true)}>Open Modal</Button>
      </View>
    );
  }

  return (
    <ScreenContainer screenName={route.name}>
      {renderHeroDetails()}
      <CharacterModal modalOpen={modalOpen} modalAction={setModalOpen} />
      <Button onPress={() => navigation.toggleDrawer()}>Drawer</Button>
    </ScreenContainer>
  );
};

export default Home;
