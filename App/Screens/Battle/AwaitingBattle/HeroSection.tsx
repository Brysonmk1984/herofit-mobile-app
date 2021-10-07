import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { VStack, Text, Box, FlatList } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { HeroImage } from "../../../Components/HeroImage/HeroImage";
import { capitalize, equippedSkin, getColorFromClassName, getColorFromItemName } from "../../../common/helperFunctions";
import { GlobalStateContext } from "../../../store";
import { Item } from "../../../common/types";

interface HeroSectionProps {
  height: number;
  rewards: Item[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ height, rewards }) => {
  const { state } = useContext(GlobalStateContext);
  const propsForHeroImage = (({ character, equipped, alias, status }) => ({ character, equipped, alias, skin: equippedSkin(equipped), status }))(state.hero);
  const heroColors = [state.hero.colors[0], "#ffffff"];

  function renderItem(item: Item) {
    const color = item.class ? getColorFromClassName(item.class) : getColorFromItemName(item.name);
    return (
      <Text textAlign="right">
        <Text>New {capitalize(item.type)}</Text> - <Text color={color}>{item.name}</Text>
      </Text>
    );
  }

  function renderRewards(rewards: Item[]) {
    return (
      <VStack>
        <FlatList data={rewards} renderItem={({ item }: { item: Item }) => renderItem(item)} keyExtractor={(item, i) => i.toString()} />
      </VStack>
    );
  }

  return (
    <Box flex={1}>
      <LinearGradient end={{ x: 0.5, y: 1 }} colors={heroColors} style={styles.heroGradient} />
      {/* <Animated.View style={{ transform: [{ translateX: 0 }] }}> */}
      <Box position="absolute" left={-80} top={-45}>
        <HeroImage width={height * 0.5} height={height * 0.5} {...propsForHeroImage} />
      </Box>
      {/* </Animated.View> */}
      <VStack position="absolute" right={1} top={1}>
        <Text textAlign="right" fontSize={state.hero.name.length > 10 ? 37 : 50} fontFamily="heading">
          {state.hero.name}
        </Text>
        <Text color="primary.800" mt={-8} textAlign="right" fontSize={30}>
          {state.hero.alias}
        </Text>
        {rewards && renderRewards(rewards)}
      </VStack>
    </Box>
  );
};

export default HeroSection;

const styles = StyleSheet.create({
  heroGradient: { height: "100%", width: "100%" },
});
