import React, { useRef } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import { View, Text, Button, Box } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import Triangle from "./Triangle";

interface BottomDrawerProps {}

const BottomDrawer: React.FC<BottomDrawerProps> = ({}) => {
  const windowHeight = useWindowDimensions().height;
  const bottomDrawerHeight = windowHeight / 2;
  const closedDrawerHeight = bottomDrawerHeight / 4;
  const refRBSheet = useRef({ open: () => null });
  return (
    <Box position="absolute" bottom={0}>
      <Box>
        <Box alignItems="center">
          <Triangle action={() => refRBSheet.current.open()} />
        </Box>
        <Box display="flex" flexDirection="row" backgroundColor="base.primary">
          <Box w="50%" p={2} borderRightWidth={1} borderRightColor="primary.800">
            <Button _text={{ fontFamily: "heading", fontSize: 30 }} borderRadius="0px">
              Quantum
            </Button>
          </Box>
          <Box w="50%" p={2}>
            <Button _text={{ fontFamily: "heading", fontSize: 30 }} borderRadius={0}>
              Battle
            </Button>
          </Box>
        </Box>
      </Box>
      <View style={styles.bottomDrawer}>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          customStyles={{
            wrapper: {
              backgroundColor: "transparent",
            },
            draggableIcon: {
              backgroundColor: "#000",
            },
          }}
        >
          <Text>TEST</Text>
          <Text>TEST</Text>
          <Text>TEST</Text>
          <Text>TEST</Text>
          <Text>TEST</Text>
          <Text>TEST</Text>
          <Text>TEST</Text>
          <Text>TEST</Text>
          <Text>TEST</Text>
        </RBSheet>
      </View>
    </Box>
  );
};

export default BottomDrawer;

const styles = StyleSheet.create({
  bottomDrawer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
