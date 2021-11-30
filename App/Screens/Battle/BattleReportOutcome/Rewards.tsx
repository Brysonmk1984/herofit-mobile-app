import React from "react";
import { VStack, Text, Pressable } from "native-base";
import { FlatList } from "react-native";
import { capitalize, getColorFromClassName, getColorFromItemName } from "../../../common/helperFunctions";
import { Item } from "../../../common/types";

interface RewardsProps {
  reversedText: boolean;
  topOrBottom: "top" | "bottom";
  setPressedItem: (item: Item) => void;
  itemsAcquired?: Item[];
  xpGain?: number;
  ptGain?: number;
}

const Rewards: React.FC<RewardsProps> = ({ reversedText, topOrBottom, itemsAcquired, ptGain, xpGain, setPressedItem }) => {
  function renderItem(item: Item) {
    const color = item.class ? getColorFromClassName(item.class) : getColorFromItemName(item.name);
    return (
      <Pressable
        onPress={() => {
          setPressedItem(item);
        }}
      >
        <Text textAlign="right" textDecoration="underline">
          <Text color="base.link">New {capitalize(item.type)}</Text> - <Text color={color}>{item.name}</Text>
        </Text>
      </Pressable>
    );
  }

  function renderRewards(rewards: Item[], reversedText = true) {
    return (
      <VStack mt={0}>
        {xpGain > 0 && (
          <Text color={reversedText ? "base.white" : "primary.900"} fontFamily="heading" textAlign="right" fontSize="2xl">
            +{xpGain} XP
          </Text>
        )}
        {ptGain > 0 && (
          <Text color={reversedText ? "base.white" : "primary.900"} mt={-5} fontFamily="heading" textAlign="right" fontSize="2xl">
            +{ptGain} PT
          </Text>
        )}
        {itemsAcquired ? (
          <>
            <Text color={reversedText ? "base.white" : "primary.900"} mt={-5} mb={0} textAlign="right" fontFamily="heading" fontSize="2xl" textDecoration="underline">
              Rewards
            </Text>
            <FlatList data={rewards} renderItem={({ item }: { item: Item }) => renderItem(item)} keyExtractor={(item, i) => i.toString()} />
          </>
        ) : null}
      </VStack>
    );
  }

  return (
    <>
      {topOrBottom === "top" ? (
        <VStack position="absolute" right={5} top={-20} zIndex={1000}>
          {renderRewards(itemsAcquired, reversedText)}
        </VStack>
      ) : (
        <VStack position="absolute" left={5} bottom={1} zIndex={1000}>
          {renderRewards(itemsAcquired)}
        </VStack>
      )}
    </>
  );
};

export default Rewards;
