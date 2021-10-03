import React, { useContext, useRef, useState } from "react";
import { Button, Platform, useWindowDimensions } from "react-native";
import { Center, Heading, Box, HStack, VStack, Text, ScrollView, FlatList, View, useTheme, Input, Pressable } from "native-base";
import { ScreenContainer, ScreenActionButton, Header, Icon, Pane } from "../../Components/CustomComponents";
import useModal from "../../common/hooks/useModal";
import { AuthStackProps } from "../../common/types-navigator";
import { GlobalStateContext } from "../../store";
import RBSheet from "react-native-raw-bottom-sheet";
import activityList from "../../common/activityList.json";
import { PrimaryElements, Stat } from "../../common/types";
import DateTimeDuration from "./DateTimeDuration";
import PressableInput from "../../Components/PressableInput";
import SpeedModal from "./SpeedModal";
import DistanceModal from "./DistanceModal";
import DurationModal from "./DurationModal";
import { convertMilesToMeters, convertMilesHoursToMetersSeconds, convertDurationStringToSeconds } from "../../common/activityCalculations";

const ManualActivity = ({ route, navigation }: AuthStackProps<"SpendQP">) => {
  // Global State
  const { state, dispatch } = useContext(GlobalStateContext);
  const windowHeight = useWindowDimensions().height;
  const refRBSheet = useRef({ open: () => null, close: () => null });
  const bottomDrawerHeight = windowHeight / 2;
  const { colors } = useTheme();
  const [activity, setActivity] = useState(null);
  const [date, setDate] = useState();
  const [duration, setDuration] = useState("0 min");
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const { openModal } = useModal();

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
          setActivity(act.type);
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
        <Box mt={2}>{activity === act.type ? <Icon iconName="success" size={6} color="base.white" /> : <Text>&nbsp;</Text>}</Box>
      </Pressable>
    );
  }

  function handleSubmit(activity: string, date: Date, duration: string, distance: number, speed: number) {
    const totalMeters = convertMilesToMeters(distance);
    const averageMetersPerSecond = convertMilesHoursToMetersSeconds(speed);
    const totalSeconds = convertDurationStringToSeconds(duration);
    //console.log(distance, typeof distance, totalMeters, speed, typeof speed, averageMetersPerSecond);

    console.log(duration, totalSeconds);
  }

  return (
    <ScreenContainer screenName={route.name}>
      <Center>
        <Header text="Manual Activity" />
        <Heading>
          <Text color="primary.800" fontFamily="heading" fontSize="xl">
            Manually record an activity you've completed
          </Text>
        </Heading>
      </Center>
      <Pane>
        {/* ALL INPUTS */}
        <VStack space={2}>
          {/* Activity Type Input */}
          <PressableInput ml={2} mr={2} value={activityList.find(act => act.type === activity)?.alias} placeholder="Select Activity" action={() => refRBSheet.current.open()} />

          {/* Date - Time - Duration Input */}
          <DateTimeDuration
            setParentDate={setDate}
            render={() => {
              return <PressableInput flex={1} ml={2} mr={2} action={() => openModal("DurationModal")} value={duration} />;
            }}
          />
          <HStack>
            {/* Distance Input */}
            <PressableInput flex={1} ml={2} mr={2} action={() => openModal("DistanceModal")} value={`${distance} mi`} />
            {/* Speed Input */}
            <PressableInput flex={1} ml={2} mr={2} action={() => openModal("SpeedModal")} value={`${speed} mph`} />
          </HStack>
        </VStack>
      </Pane>
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

      {/* Duration Wheel Selector */}
      <DurationModal id="DurationModal" title="Duration" modalAction={setDuration} duration={duration} />

      {/* Distance Wheel Selector */}
      <DistanceModal id="DistanceModal" title="Distance" modalAction={setDistance} distance={distance} />

      {/* Speed Wheel Selector */}
      <SpeedModal id="SpeedModal" title="Speed" modalAction={setSpeed} speed={speed} />

      <ScreenActionButton text="Apply Activity to Hero" action={() => handleSubmit(activity, date, duration, distance, speed)} />
    </ScreenContainer>
  );
};

export default ManualActivity;
