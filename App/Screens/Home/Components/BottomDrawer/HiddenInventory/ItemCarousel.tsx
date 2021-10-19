import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, SafeAreaView, Dimensions, Pressable, ImageBackground } from "react-native";
import { View, Text, Image, Box } from "native-base";
import { CharacterName, Item, ItemType } from "../../../../../common/types";
import Carousel from "react-native-snap-carousel";
import { getColorFromClassName, getColorFromItemName, getHeroImage, getPetImage } from "../../../../../common/helperFunctions";
import { Icon } from "../../../../../Components/CustomComponents";
import { HeroImage } from "../../../../../Components/HeroImage/HeroImage";

interface ItemCarouselProps {
  type: Lowercase<ItemType>;
  data: Item[];
  equipped?: Item;
  character?: CharacterName;
}

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.32);
const ITEM_HEIGHT = ITEM_WIDTH;
const ITEM_IMAGE_WIDTH = ITEM_WIDTH * 1.2;
const ITEM_IMAGE_HEIGHT = ITEM_WIDTH * 1.2;

const ItemCarousel: React.FC<ItemCarouselProps> = ({ type, data, equipped, character }) => {
  const [activeIndex, setActiveIndex] = useState(equipped ? data.findIndex(item => item.name === equipped.name) : Math.floor(data.length / 2));

  function _getItemImage(item: Item, type: Lowercase<ItemType>, activeItem: Item) {
    const iconColor = item.class ? getColorFromClassName(item.class) : getColorFromItemName(item.name, true);

    switch (type) {
      case "consumables":
        return (
          <Box style={styles.itemImage}>
            <Text textAlign="center">
              <Icon iconName={item.name} size={ITEM_IMAGE_WIDTH} color={iconColor} />
            </Text>
          </Box>
        );
      case "pets":
        return <Image style={styles.itemImage} source={getPetImage(item.name)} alt={item.name} resizeMode="contain" />;

      case "costumes":
        return (
          <Box position="absolute" alignSelf="center">
            <HeroImage character={character} width={ITEM_IMAGE_WIDTH} height={ITEM_IMAGE_HEIGHT} skin={item} />
          </Box>
        );
      case "titles":
        return (
          <Box style={styles.itemImage}>
            <Text textAlign="center">
              <Icon iconName={item.name} size={ITEM_IMAGE_WIDTH} color={iconColor} />
            </Text>
          </Box>
        );
      case "codex":
        return (
          <Box style={styles.itemImage}>
            <Text textAlign="center">
              <Icon iconName={item.name} size={ITEM_IMAGE_WIDTH} color={iconColor} />
            </Text>
          </Box>
        );
      default:
        return (
          <Box style={styles.itemImage}>
            <Icon iconName={"?"} size={ITEM_IMAGE_WIDTH} color={iconColor} />
          </Box>
        );
    }
  }

  function _renderItem({ item, index }) {
    const activeItem = index === activeIndex;
    //const image = type === "pets" ? getPetImage(item.name) : type === "costumes" ? getHeroImage(character, item.name) : require("../../../../../../assets/images/items/pets/alpha_dog.webp");

    return (
      <Pressable onPress={() => console.log(item.name)}>
        <View bg={"base.primary"} style={styles.itemContainer}>
          <ImageBackground source={require("../../../../../../assets/images/layout/carousel-background.webp")} resizeMode="contain" style={styles.panelBackground} />
        </View>
        {_getItemImage(item, type, activeItem)}
        {/* 
        {activeItem ? (
          <Image style={styles.itemImage} source={image} alt={item.name} resizeMode="contain" />
        ) : (
          <>
            <Image style={[styles.itemImage, { tintColor: "black" }]} source={image} alt={item.name} resizeMode="contain" />
            <Image style={[styles.itemImage, { position: "absolute", opacity: 0.3 }]} source={image} alt={item.name} resizeMode="contain" />
          </>
        )} */}
      </Pressable>
    );
  }

  function _handleSelectedItem(index: number) {
    setActiveIndex(index);
    console.log(index, data[index].name);
  }

  // useEffect(() => {
  //   if (equipped) {
  //     console.log("EEEEEEEE", equipped);
  //     const indexOfEquipped = data.findIndex(item => item.name === equipped.name);
  //     console.log("ASDASD", indexOfEquipped);
  //     setActiveIndex(indexOfEquipped);
  //   } else {
  //     setActiveIndex(Math.floor(data.length / 2));
  //   }
  // }, []);

  return (
    <SafeAreaView style={styles.carouselWrapper}>
      <View>
        <Text fontFamily="heading" color="base.highlight" fontSize="3xl" textAlign="center">
          {data[activeIndex] ? data[activeIndex].name : "No Items"}
        </Text>
      </View>
      <View style={styles.carouselView}>
        <Carousel enableMomentum={true} firstItem={activeIndex} containerCustomStyle={styles.carouselContainer} onSnapToItem={index => _handleSelectedItem(index)} data={data} renderItem={_renderItem} sliderWidth={SLIDER_WIDTH} itemWidth={SLIDER_WIDTH * 0.28} inactiveSlideOpacity={1} inactiveSlideScale={0.6} />
      </View>
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
    marginTop: ITEM_HEIGHT * 0.1,
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
