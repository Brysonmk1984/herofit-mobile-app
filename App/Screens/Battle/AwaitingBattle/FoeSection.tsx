import React, { useContext, useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { VStack, Text, Box } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { getFoeColor } from "../../../common/helperFunctions";
import { CharacterName, Foe } from "../../../common/types";
import FoeImage from "../../../Components/FoeImage";

interface FoeSectionProps {
  height: number;
  width: number;
  foe: Foe;
  character: CharacterName;
}

const FoeSection: React.FC<FoeSectionProps> = ({ height: deviceHeight, width: deviceWidth, foe, character }) => {
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
    <Box w="100%" flex={1}>
      <LinearGradient end={{ x: 1, y: 0.5 }} colors={foeColors} style={styles.foeGradient} />
      <Animated.View position="absolute" right={90} bottom={-50} zIndex={1} style={{ transform: [{ translateX: slideAnim }], opacity: opacityAnim }}>
        <FoeImage width={deviceHeight * 0.5} height={deviceHeight * 0.5} foeType={foe.type} heroCharacterName={foe.type === "Shadow-Self" ? character : null} />
      </Animated.View>
      <VStack position="absolute" left={1} bottom={1}>
        <Text fontSize={nameSize} fontFamily="heading">
          {foe.name}
        </Text>
        <Text color="primary.800" mt={-8} fontSize={26} fontFamily="heading">
          {foe.type}
        </Text>
      </VStack>
    </Box>
  );
};

export default FoeSection;

const styles = StyleSheet.create({
  foeGradient: { height: "100%", width: "100%" },
});
