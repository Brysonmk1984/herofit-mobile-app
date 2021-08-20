import React, { useRef } from 'react';
import { Dimensions, Platform, SafeAreaView, ImageBackground, StyleSheet, Pressable } from 'react-native';
import {  Image, NativeBaseProvider, Box, View, Text, Heading, Center, VStack, FormControl, Input, Link, Button, Icon, IconButton, HStack, Divider } from 'native-base';
import Carousel from 'react-native-snap-carousel';
import { getHeroImage } from '../common/helperFunctions';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.65);
const ITEM_HEIGHT = ITEM_WIDTH;

export default function HeroCarousel({ heroList, setActiveHero, viewDetails }){
  
  function _renderItem({ item, index }){
    return (
      <Pressable onPress={() => viewDetails(item)}>
        <View bg={item.colors[0]} style={[styles.itemContainer]}>
          <ImageBackground source={require('../../assets/images/layout/carousel-background.webp')}  resizeMode="cover" style={styles.panelBackground} >
            <Image style={styles.heroImage} source={getHeroImage(item.character)} alt={item.alias} />
          </ImageBackground>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.carouselWrapper}>
      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
        <Carousel
         
          containerCustomStyle={styles.carouselContainer}
          onSnapToItem={(i) => setActiveHero(heroList[i])}
          data={heroList}
          renderItem={_renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={250}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  carouselWrapper:{
    elevation: (Platform.OS === 'android') ? 50 : 0,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1000,
    marginTop: Dimensions.get('window').height * .17,

  },
  carouselContainer: {

  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: -3, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 2,  
    elevation: 5,
    marginBottom: 12,
    marginTop: 12,
    overflow: 'visible'
  },
  panelBackground:{
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'visible'
  },
  heroImage:{
    height: 260,
    width: 260,
    position: 'absolute'
  }
});