import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Platform, SafeAreaView, Dimensions, Pressable, ImageBackground } from "react-native";
import { View, Text, Box } from "native-base";
import { CharacterName, ItemWithOwnership, Item, ServerItemType, EquippableItemType } from "../../../../../common/types";
import Carousel from "react-native-snap-carousel";
import { getColorFromClassName, getColorFromItemName, thousandsFormat } from "../../../../../common/helperFunctions";
import { Icon } from "../../../../../Components/CustomComponents";
import { GlobalStateContext } from "../../../../../store";
import useModal from "../../../../../common/hooks/useModal";
import ItemImage from "../../../../../Components/ItemImage";
import { useDebounce, useDebouncedCallback } from "use-debounce/lib";
import { PetImage } from "../../PetImage";

interface ItemCarouselProps {
  type: ServerItemType;
  data: Item[];
  equipped?: Item;
  character?: CharacterName;
  setPressedItem: (item: Item) => void;
  handleEquipping?: (category: EquippableItemType, item?: Item) => void;
  goToBattle?: boolean;
}

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.32);
const ITEM_HEIGHT = ITEM_WIDTH;
const ITEM_IMAGE_WIDTH = ITEM_WIDTH * 1.2;
const ITEM_IMAGE_HEIGHT = ITEM_WIDTH * 1.2;

const ItemCarousel: React.FC<ItemCarouselProps> = ({ type, data, equipped, character, setPressedItem, refRBSheet, handleEquipping, goToBattle }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [allItemsOfType, setAllItemsOfType] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const { openModal } = useModal();
  const carousel = useRef(null);

  function _determineEquippableType(type: ServerItemType): type is EquippableItemType {
    const equippableTypes = ["skin", "pet", "title"];
    return equippableTypes.includes(type);
  }

  function _getItemImage(item: ItemWithOwnership, type: ServerItemType) {
    const iconColor = item.class ? getColorFromClassName(item.class) : getColorFromItemName(item.name, true);
    const IMAGE_WIDTH = ITEM_IMAGE_WIDTH * 0.8;
    const MARGIN_LEFT = 2;
    const MARGIN_TOP = 0;

    if (item.name.includes(`NO `)) {
      return (
        <Box style={styles.itemImage}>
          <Box justifyContent="center" position="absolute" w="100%" top="31%" ml={-1} zIndex="1000">
            <Text textAlign="center" color={"primary.400"} fontSize="lg">
              {item.name}
            </Text>
          </Box>
        </Box>
      );
    }

    switch (type) {
      case "consumable":
        return (
          <Box style={styles.itemImage}>
            {!item.owned && (
              <Box position="absolute" w="100%" top="33%" zIndex="1000">
                <Text textAlign="center" color={item.ptCost ? "base.brand" : "primary.400"} fontSize="lg">
                  {item.ptCost ? thousandsFormat(item.ptCost) : "NOT FOR SALE"}
                </Text>
              </Box>
            )}
            <ItemImage item={item} w={IMAGE_WIDTH} reverseIconDefaultColor={true} />
            {item.count && (
              <Box position="absolute" bottom={4} right={3} borderRadius={4} h={8} w={8} bgColor="primary.800">
                <Text color="base.highlight" fontFamily="heading" textAlign="center" lineHeight={33} fontSize="2xl">
                  {item.count}
                </Text>
              </Box>
            )}
          </Box>
        );
      case "pet":
        return (
          <>
            {!item.owned && (
              <Box position="absolute" w="100%" top="33%" zIndex="1000">
                <Text textAlign="center" color={item.ptCost ? "base.brand" : "primary.400"} fontSize="lg">
                  {item.ptCost ? thousandsFormat(item.ptCost) : "NOT FOR SALE"}
                </Text>
              </Box>
            )}
            <ItemImage style={[styles.itemImage, { width: IMAGE_WIDTH, height: IMAGE_WIDTH, marginLeft: MARGIN_LEFT, marginTop: MARGIN_TOP }]} item={item} character={character} w={IMAGE_WIDTH} />
          </>
        );

      case "skin":
        return (
          <Box position="absolute" alignSelf="center">
            {!item.owned && (
              <Box position="absolute" w="100%" top="33%" zIndex="1000">
                <Text textAlign="center" color={item.ptCost ? "base.brand" : "primary.400"} fontSize="lg">
                  {item.ptCost ? thousandsFormat(item.ptCost) : "NOT FOR SALE"}
                </Text>
              </Box>
            )}
            <ItemImage item={item} character={character} w={IMAGE_WIDTH} />
          </Box>
        );
      case "title":
        return (
          <Box style={styles.itemImage}>
            {!item.owned && (
              <Box position="absolute" w="100%" top="33%" zIndex="1000">
                <Text textAlign="center" color={item.ptCost ? "base.brand" : "primary.400"} fontSize="lg">
                  {item.ptCost ? thousandsFormat(item.ptCost) : "NOT FOR SALE"}
                </Text>
              </Box>
            )}
            <ItemImage item={item} w={IMAGE_WIDTH} reverseIconDefaultColor={true} />
          </Box>
        );
      case "codex":
        return (
          <Box style={styles.itemImage}>
            {!item.owned && (
              <Box position="absolute" w="100%" top="33%" zIndex="1000">
                <Text textAlign="center" color={item.ptCost ? "base.brand" : "primary.400"} fontSize="lg">
                  {item.ptCost ? thousandsFormat(item.ptCost) : "NOT FOR SALE"}
                </Text>
              </Box>
            )}
            <ItemImage item={item} w={IMAGE_WIDTH} reverseIconDefaultColor={true} />
          </Box>
        );
      default:
        return (
          <Box style={styles.itemImage}>
            <Icon iconName={"?"} size={IMAGE_WIDTH} color={iconColor} reverseIconDefaultColor={true} />
          </Box>
        );
    }
  }

  function _renderItem({ item, index }) {
    return (
      <Pressable style={{ marginLeft: -4 }} onPress={() => _handleSelectedItem(index, item)}>
        {/* Background image */}
        <View bg={"base.primary"} style={[styles.itemContainer]}>
          <ImageBackground source={require("../../../../../../assets/images/layout/carousel-background.webp")} resizeMode="contain" style={styles.panelBackground} />
        </View>
        {/* Item image or icon */}
        {_getItemImage(item, type)}
        {/* Darken filter for items not owned */}
        {!item.owned && <View bg={"base.black"} opacity={0.4} style={[styles.itemContainer, { position: "absolute" }]}></View>}
      </Pressable>
    );
  }

  // const _delayedSelection = useDebouncedCallback((type: EquippableItemType, activeIndex?: number) => {
  //   handleEquipping(type, activeIndex ? allItemsOfType[activeIndex] : null, goToBattle);
  // }, 750);

  function _handleSelectedItem(index: number, item: Item) {
    setActiveIndex(index);
    const selectedItem = allItemsOfType[index];
    // Equipping item - only for equippable Item types
    if (_determineEquippableType(type)) {
      // AND must own item
      if (selectedItem.owned) {
        //_delayedSelection(type, index);
        // For unequipping
        _openModal(item, index);
      } else if (selectedItem.name.includes("NO ")) {
        handleEquipping(type);
      }
      // Anything else doesn't get equipped (unowned items)
    } else {
      _openModal(item, index);
    }
  }

  function _openModal(item: Item | ItemWithOwnership, index: number) {
    if (index !== activeIndex) {
      carousel.current.snapToItem(index);
    }

    if (!item.name.includes("NO ")) {
      setPressedItem(item);
      setTimeout(() => openModal("ItemDetail"), 100);
      refRBSheet.current.close();
    }
  }

  useEffect(() => {
    // Filter down to just items of carousel type
    const filteredToItemType = state.allGameItems.filter(item => item.type === type);

    // Add "owned" property to filtered items
    const itemsWithOwnership: ItemWithOwnership[] = filteredToItemType.map((item: any) => {
      if (type === "consumable" && item.type === "consumable") {
        // Since consumables can stack, set consumable item to be included in  unowned item list
        item.owned = false;
      } else if (data.map(ownedItem => ownedItem.name).includes(item.name)) {
        // "data" are items of this category that the user owns
        item.owned = true;
      } else {
        item.owned = false;
      }
      return item;
    });

    // Divide ItemsWithOwnership into two arrays, owned and unowned
    const unownedItems = itemsWithOwnership
      .filter(item => item.owned === false)
      // Sort by ptCost
      .sort((a, b) => a.ptCost - b.ptCost)
      // Sort by buyable
      //@ts-ignore
      .sort((a, b) => (b.ptCost === null ? false : true));
    // Consumables in 'data' are owned but haven't had the property set yet, so do it here, otherwise use itemsWithOwnership from above
    const ownedItems = type === "consumable" ? data.map(item => ({ ...item, owned: true })) : itemsWithOwnership.filter(item => item.owned === true);

    // Final items array, with owned items at the front
    const items = [...ownedItems, ...unownedItems];

    // Add item type for 'no item' for categories that are equippable
    if (_determineEquippableType(type)) {
      const name = type === "skin" ? "NO COSTUME" : `NO ${type.toUpperCase()}`;
      const nothingItem = { type, name } as ItemWithOwnership;
      items.unshift(nothingItem);
    }
    // Set completed array to state
    setAllItemsOfType(items);
    // Set active Index to equipped item, or halfway through
    const startingActiveIndex = equipped ? items.findIndex(item => item.name === equipped.name) : 0;
    setActiveIndex(startingActiveIndex);
  }, [data]);

  return (
    <SafeAreaView style={styles.carouselWrapper}>
      <View>
        <Text fontFamily="heading" color="base.highlight" fontSize="3xl" textAlign="center" mb={1}>
          {allItemsOfType[activeIndex] && allItemsOfType[activeIndex].name}
        </Text>
      </View>
      {activeIndex !== null && (
        <View style={styles.carouselView}>
          <Carousel ref={carousel} firstItem={activeIndex} containerCustomStyle={styles.carouselContainer} /*onSnapToItem={index => _handleSelectedItem(index)}*/ data={allItemsOfType} renderItem={_renderItem} sliderWidth={SLIDER_WIDTH} itemWidth={SLIDER_WIDTH * 0.28} inactiveSlideOpacity={1} inactiveSlideScale={0.6} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ItemCarousel;

const styles = StyleSheet.create({
  carouselWrapper: {
    elevation: Platform.OS === "android" ? 101 : 0,
    position: "absolute",
    left: -10,
    bottom: 10,
    zIndex: 1000,
  },
  carouselContainer: {},
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    overflow: "hidden",

    marginBottom: 10,
  },
  panelBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflow: "visible",
  },
  itemImage: {
    height: ITEM_IMAGE_HEIGHT,
    width: ITEM_IMAGE_WIDTH,
    position: "absolute",
    left: 0,
    marginLeft: -7,
    opacity: 1,
  },
  carouselView: { flex: 1, flexDirection: "row", justifyContent: "center" },
});
