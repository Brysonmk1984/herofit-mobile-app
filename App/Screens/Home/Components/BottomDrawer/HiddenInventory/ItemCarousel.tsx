import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Platform, SafeAreaView, Dimensions, Pressable, ImageBackground } from "react-native";
import { View, Text, Image, Box } from "native-base";
import { CharacterName, ItemWithOwnership, Item, ItemType } from "../../../../../common/types";
import Carousel from "react-native-snap-carousel";
import { capitalize, getColorFromClassName, getColorFromItemName, getHeroImage, getPetImage, thousandsFormat } from "../../../../../common/helperFunctions";
import { Icon } from "../../../../../Components/CustomComponents";
import { HeroImage } from "../../../../../Components/HeroImage/HeroImage";
import { GlobalStateContext } from "../../../../../store";
import useModal from "../../../../../common/hooks/useModal";
import ItemDetail from "./Modals/ItemDetail";
import ItemImage from "../../../../../common/ItemImage";

interface ItemCarouselProps {
  type: Lowercase<ItemType>;
  data: Item[];
  equipped?: Item;
  character?: CharacterName;
}

type AllSliderItems = ItemWithOwnership[];

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.32);
const ITEM_HEIGHT = ITEM_WIDTH;
const ITEM_IMAGE_WIDTH = ITEM_WIDTH * 1.2;
const ITEM_IMAGE_HEIGHT = ITEM_WIDTH * 1.2;

const ItemCarousel: React.FC<ItemCarouselProps> = ({ type, data, equipped, character }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [allItemsOfType, setAllItemsOfType] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [pressedItem, setPressedItem] = useState(null);
  const { openModal } = useModal();
  const carousel = useRef(null);
  const unequippedTypes = ["costumes", "pets", "titles"];

  function _getItemImage(item: ItemWithOwnership, type: Lowercase<ItemType>) {
    const iconColor = item.class ? getColorFromClassName(item.class) : getColorFromItemName(item.name, true);
    const IMAGE_WIDTH = ITEM_IMAGE_WIDTH * 0.8;
    const MARGIN_LEFT = 2;
    const MARGIN_TOP = 0;

    if (item.name.includes(`NO `)) {
      return (
        <Box style={styles.itemImage}>
          <Box justifyContent="center" position="absolute" w="100%" top="30%" ml={-1} zIndex="1000">
            <Text textAlign="center" color={"primary.400"}>
              {item.name}
            </Text>
          </Box>
        </Box>
      );
    }

    switch (type) {
      case "consumables":
        return (
          <Box style={styles.itemImage}>
            {item.unowned && (
              <Box position="absolute" w="100%" top="35%" zIndex="1000">
                <Text textAlign="center" color={item.ptCost ? "base.brand" : "primary.400"} ml={-2}>
                  {item.ptCost ? thousandsFormat(item.ptCost) : "NOT FOR SALE"}
                </Text>
              </Box>
            )}
            <ItemImage item={item} w={IMAGE_WIDTH} reverseIconDefaultColor={true} />
            {item.count && (
              <Box position="absolute" bottom={4} right={3} borderRadius={4} h={8} w={8} bgColor="primary.800">
                <Text color="base.highlight" fontFamily="heading" textAlign="center" lineHeight={8} fontSize="2xl">
                  {item.count}
                </Text>
              </Box>
            )}
          </Box>
        );
      case "pets":
        return (
          <>
            {item.unowned && (
              <Box position="absolute" w="100%" top="35%" zIndex="1000">
                <Text textAlign="center" color={item.ptCost ? "base.brand" : "primary.400"} ml="2">
                  {item.ptCost ? thousandsFormat(item.ptCost) : "NOT FOR SALE"}
                </Text>
              </Box>
            )}
            <ItemImage style={[styles.itemImage, { width: IMAGE_WIDTH, height: IMAGE_WIDTH, marginLeft: MARGIN_LEFT, marginTop: MARGIN_TOP }]} item={item} character={character} w={IMAGE_WIDTH} />
          </>
        );

      case "costumes":
        return (
          <Box position="absolute" alignSelf="center">
            {item.unowned && (
              <Box position="absolute" w="100%" top="35%" zIndex="1000">
                <Text textAlign="center" color={item.ptCost ? "base.brand" : "primary.400"} ml="2">
                  {item.ptCost ? thousandsFormat(item.ptCost) : "NOT FOR SALE"}
                </Text>
              </Box>
            )}
            <ItemImage item={item} character={character} w={IMAGE_WIDTH} />
          </Box>
        );
      case "titles":
        return (
          <Box style={styles.itemImage}>
            {item.unowned && (
              <Box position="absolute" w="100%" top="35%" zIndex="1000">
                <Text textAlign="center" color={item.ptCost ? "base.brand" : "primary.400"} ml="2">
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
            {item.unowned && (
              <Box position="absolute" w="100%" top="35%" zIndex="1000">
                <Text textAlign="center" color={item.ptCost ? "base.brand" : "primary.400"} ml="2">
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
    const activeItem = index === activeIndex;
    return (
      <Pressable style={{ marginLeft: -4 }} onPress={() => _openModal(item, index)}>
        {/* Background image */}
        <View bg={"base.primary"} style={[styles.itemContainer]}>
          <ImageBackground source={require("../../../../../../assets/images/layout/carousel-background.webp")} resizeMode="contain" style={styles.panelBackground} />
        </View>
        {/* Item image or icon */}
        {_getItemImage(item, type)}
        {/* Darken filter for items not owned */}
        {item.unowned && <View bg={"base.black"} opacity={0.4} style={[styles.itemContainer, { position: "absolute" }]}></View>}
      </Pressable>
    );
  }

  function _handleSelectedItem(index: number) {
    setActiveIndex(index);
    // console.log(index, data[index].name);
  }

  function _openModal(item: Item | ItemWithOwnership, index: number) {
    if (index !== activeIndex) {
      carousel.current.snapToItem(index);
    }
    if (!item.name.includes("NO ")) {
      setPressedItem(item);
      openModal("ItemDetail");
    }
  }

  useEffect(() => {
    if (data) {
      const typeMap = { costumes: "skin", pets: "pet", titles: "title", consumables: "consumable", codex: "codex" };

      const unownedItems: Item[] | AllSliderItems = state.allGameItems
        // Filter all game items down to just the items of the selected item type
        .filter(item => {
          if (type === "consumables" && item.type === "consumable") {
            // Since consumables can stack, set consumable item to unowned
            return true;
          } else {
            // Otherwise Filter all game items down to just the items of the selected item type
            return item.type === typeMap[type] && !data.map(item => item.name).includes(item.name);
          }
        })
        // add 'unowned' to item if user doesn't own the item
        .map(item => ({ ...item, unowned: true }))
        // Sort by ptCost
        .sort((a, b) => a.ptCost - b.ptCost)
        // Sort by buyable
        //@ts-ignore
        .sort((a, b) => (b.ptCost === null ? false : true));

      const items = [...data, ...unownedItems];

      if (unequippedTypes.includes(type)) {
        const name = type === "costumes" ? "NO COSTUME" : `NO ${typeMap[type].toUpperCase()}`;
        const nothingItem = { type: typeMap[type], name } as Item;
        items.unshift(nothingItem);
      }

      setAllItemsOfType(items);
      const startingActiveIndex = equipped ? data.findIndex(item => item.name === equipped.name) : Math.floor(data.length / 2);
      setActiveIndex(startingActiveIndex);
    }
  }, [data]);

  return (
    <SafeAreaView style={styles.carouselWrapper}>
      <View>
        <Text fontFamily="heading" color="base.highlight" fontSize="3xl" textAlign="center" mt={-7} mb={5}>
          {allItemsOfType[activeIndex] && allItemsOfType[activeIndex].name}
        </Text>
      </View>
      {activeIndex !== null && (
        <View style={styles.carouselView}>
          <Carousel ref={carousel} enableMomentum={true} firstItem={activeIndex} containerCustomStyle={styles.carouselContainer} onSnapToItem={index => _handleSelectedItem(index)} data={allItemsOfType} renderItem={_renderItem} sliderWidth={SLIDER_WIDTH} itemWidth={SLIDER_WIDTH * 0.28} inactiveSlideOpacity={1} inactiveSlideScale={0.6} />
        </View>
      )}
      {pressedItem && <ItemDetail id="ItemDetail" item={pressedItem} character={character} />}
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
