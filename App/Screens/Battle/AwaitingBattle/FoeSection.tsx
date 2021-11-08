import React, { useContext, useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { VStack, Text, Box, Pressable, HStack } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { getFoeColor } from "../../../common/helperFunctions";
import { CharacterName, Foe } from "../../../common/types";
import FoeImage from "../../../Components/FoeImage";
import { Icon } from "../../../Components/CustomComponents";

interface FoeSectionProps {
  height: number;
  width: number;
  foe: Foe;
  character: CharacterName;
  handleNavigation: () => void;
}

const FoeSection: React.FC<FoeSectionProps> = ({ height: deviceHeight, width: deviceWidth, foe, character, handleNavigation }) => {
  const foeColors = ["#ffffff", getFoeColor(foe.type)];
  const nameSize = foe.name.length > 10 ? 37 : foe.name.length > 6 ? 50 : 66;
  const endXPosition = deviceWidth - 200;
  const slideAnim = useRef(new Animated.Value(-275)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: endXPosition,
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
      <LinearGradient end={{ x: 1, y: 0.5 }} colors={foeColors} style={styles.foeGradient} />
      <Animated.View position="absolute" right={150} bottom={-25} zIndex={1} style={{ transform: [{ translateX: slideAnim }], opacity: opacityAnim }}>
        <FoeImage width={deviceHeight * 0.35} height={deviceHeight * 0.35} foeType={foe.type} heroCharacterName={foe.type === "Shadow-Self" ? character : null} />
      </Animated.View>
      <VStack position="absolute" left={1} bottom={1}>
        <Text fontSize={nameSize} fontFamily="heading">
          {foe.name}
        </Text>
        <Text color="primary.800" mt={-8} fontSize={26} fontFamily="heading">
          {foe.type}
        </Text>
        <HStack mt={-8}>
          <Text mr={1}>
            <Icon iconName="bullseye" size={16} color="primary.800" />
          </Text>
          <Text fontSize={16} fontFamily="heading">
            {foe.ability?.name}
          </Text>
          <Text opacity={0.3} fontFamily="heading" fontSize={16} pl={2}>
            {foe.ability?.effect}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default FoeSection;

const styles = StyleSheet.create({
  foeGradient: { height: "100%", width: "100%" },
});
