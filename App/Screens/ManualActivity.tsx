import React, { useContext, useRef, useState } from "react";
import { Center, Heading, Box, HStack, Text, ScrollView, FlatList, View, useTheme, Input, Pressable } from "native-base";
import { ScreenContainer, ScreenActionButton, Header, Icon } from "../Components/CustomComponents";
import { AuthStackProps } from "../common/types-navigator";
import { GlobalStateContext } from "../store";
import RBSheet from "react-native-raw-bottom-sheet";
import activityList from "../common/activityList.json";
import { PrimaryElements, Stat } from "../common/types";
import { useWindowDimensions } from "react-native";

const ManualActivity = ({ route, navigation }: AuthStackProps<"SpendQP">) => {
  // Global State
  const { state, dispatch } = useContext(GlobalStateContext);
  const [selectedActivity, setSelectedActivity] = useState("Run");
  const windowHeight = useWindowDimensions().height;
  const refRBSheet = useRef({ open: () => null, close: () => null });
  const bottomDrawerHeight = windowHeight / 2;
  const { colors } = useTheme();
  interface ActivityType {
    type: string;
    alias: string;
    element: PrimaryElements;
    minutesPerPoint: number;
  }

  function renderActivityList(act: ActivityType) {
    return (
      <Pressable
        justifyContent="space-between"
        px={2}
        py={1}
        pt={2}
        borderBottomWidth={1}
        borderBottomColor={"primary.500"}
        onPress={() => {
          setSelectedActivity(act.type);
          refRBSheet.current.close();
        }}
        flexDirection="row"
      >
        <Icon color={`base.${act.element}`} iconName={act.type} size={act.type === "Crossfit" ? 35 : 10} />
        <Text fontSize="sm" lineHeight={40} color="primary.100">
          {act.alias}
        </Text>

        {act.type === "Workout" ? (
          <Text lineHeight={40} fontSize="sm" color="base.white">
            2 hrs per 1 <Text color="base.aether">Each Elem.</Text>
          </Text>
        ) : (
          <Text lineHeight={40} fontSize="sm" color="base.white">
            {act.minutesPerPoint} min per 1 <Text color={`base.${act.element}`}>{act.element.toUpperCase()}</Text>
          </Text>
        )}
        <Box mt={2}>{selectedActivity === act.type ? <Icon iconName="success" size={6} color="base.white" /> : <Text>&nbsp;</Text>}</Box>
      </Pressable>
    );
  }

  return (
    <ScreenContainer screenName={route.name}>
      <Center mt={0} mb={5}>
        <Header text="Manual Activity" />
        <Heading>
          <Text color="primary.800" fontFamily="heading" fontSize="xl">
            Manually record an activity you've completed
          </Text>
        </Heading>
      </Center>
      <Center>
        <Pressable w="80%" onPress={() => refRBSheet.current.open()}>
          <Box bgColor="base.white" borderColor="primary.500" borderWidth={1} borderRadius={12} pb={4} pt={3} px={3}>
            {activityList.find(act => act.type === selectedActivity)?.alias}
          </Box>
        </Pressable>
      </Center>

      {/* HIDDEN MENU */}
      <Box position="absolute" bottom={0}>
        <View flex={1} justifyContent="center" alignItems="center" backgroundColor="#000">
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={false}
            height={bottomDrawerHeight}
            openDuration={750}
            customStyles={{
              wrapper: {
                backgroundColor: "transparent",
              },
              container: {
                backgroundColor: colors.base.primary,
              },
              draggableIcon: {
                backgroundColor: "#f1c85b",
              },
            }}
          >
            <FlatList borderTopWidth={1} borderTopColor={"primary.500"} data={activityList} renderItem={({ item }) => renderActivityList(item)} keyExtractor={item => item.type} />
          </RBSheet>
        </View>
      </Box>
      <ScreenActionButton text="Apply Activity to Hero" action={() => console.log("SUBMIT!")} />
    </ScreenContainer>
  );
};

export default ManualActivity;
