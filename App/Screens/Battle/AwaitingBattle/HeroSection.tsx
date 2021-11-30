import React, { useContext, useRef, useEffect } from "react";
import { Animated, StyleSheet } from "react-native";
import { VStack, Text, Box, FlatList, Pressable } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { HeroImage } from "../../../Components/HeroImage/HeroImage";
import { capitalize, equippedSkin, getColorFromClassName, getColorFromItemName } from "../../../common/helperFunctions";
import { GlobalStateContext } from "../../../store";
import { Item } from "../../../common/types";
import useInventory from "../../../common/hooks/useInventory";
import HeroTitle from "../../../Components/HeroTitle";

interface HeroSectionProps {
  height: number;
  width: number;
  rewards: Item[];
  setPressedItem: (item: Item) => void;
  handleNavigation: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ height: deviceHeight, width: deviceWidth, rewards, setPressedItem, handleNavigation }) => {
  const { state } = useContext(GlobalStateContext);
  const { equippedSkin, equippedPet, equippedTitle } = useInventory(true);
  const propsForHeroImage = (({ character, equipped, alias, status }) => ({ character, equipped, alias, status }))(state.hero);
  const heroColors = [state.hero.colors[0], "#ffffff"];
  const nameSize = state.hero.name.length > 10 ? 37 : state.hero.name.length > 6 ? 50 : 66;
  const endWidth = -75;

  function renderItem(item: Item) {
    const color = item.class ? getColorFromClassName(item.class) : getColorFromItemName(item.name);
    return (
      <Pressable onPress={() => setPressedItem(item)}>
        <Text textAlign="right" textDecoration="underline">
          <Text color="base.link">New {capitalize(item.type)}</Text> - <Text color={color}>{item.name}</Text>
        </Text>
      </Pressable>
    );
  }

  function renderRewards(rewards: Item[]) {
    return (
      <VStack mt={-5}>
        <FlatList data={rewards} renderItem={({ item }: { item: Item }) => renderItem(item)} keyExtractor={(item, i) => i.toString()} />
      </VStack>
    );
  }

  const slideAnim = useRef(new Animated.Value(deviceWidth)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: endWidth,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    slideIn();
  }, []);

  return (
    <Pressable flex={1} onPress={() => handleNavigation()}>
      <LinearGradient start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} colors={heroColors} style={styles.heroGradient} />
      <Animated.View position="absolute" left={20} top={5} zIndex={1} style={{ transform: [{ translateX: slideAnim }], opacity: opacityAnim }}>
        <HeroImage width={deviceHeight * 0.4} height={deviceHeight * 0.4} skin={equippedSkin} {...propsForHeroImage} />
      </Animated.View>
      <VStack position="absolute" right={1} top={5} space={1}>
        <HeroTitle title={equippedTitle} justifyContent="flex-end" />

        <Text mt={-3} textAlign="right" fontSize={nameSize} fontFamily="heading">
          {state.hero.name}
        </Text>

        {rewards && renderRewards(rewards)}
      </VStack>
    </Pressable>
  );
};

export default HeroSection;

const styles = StyleSheet.create({
  heroGradient: { height: "100%", width: "100%" },
});
