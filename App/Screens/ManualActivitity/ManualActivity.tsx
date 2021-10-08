import React, { useEffect, useRef, useState } from "react";
import { Button, Platform, useWindowDimensions } from "react-native";
import { Center, Heading, Box, HStack, VStack, Text, ScrollView, FlatList, View, useTheme, Input, Pressable, Modal } from "native-base";
import { ScreenContainer, ScreenActionButton, Header, Icon, Pane, Subheader, HelperText } from "../../Components/CustomComponents";
import useModal from "../../common/hooks/useModal";
import { AuthStackProps } from "../../common/types-navigator";
import { GlobalStateContext } from "../../store";
import RBSheet from "react-native-raw-bottom-sheet";
import activityList from "../../common/activityList.json";
import { PrimaryElement, Stat } from "../../common/types";
import DateTimeDuration from "./DateTimeDuration";
import PressableInput from "../../Components/PressableInput";
import SpeedModal from "./SpeedModal";
import DistanceModal from "./DistanceModal";
import DurationModal from "./DurationModal";
import { convertMilesToMeters, convertMilesHoursToMetersSeconds, convertDurationStringToSeconds, calculateOffSet } from "../../common/activityCalculations";
import { roundNumberToTenthReturnNumber, roundNumberToThousandthReturnNumber } from "../../common/helperFunctions";
import moment from "moment";

const ManualActivity = ({ route, navigation }: AuthStackProps<"SpendQP">) => {
  const windowHeight = useWindowDimensions().height;
  const refRBSheet = useRef({ open: () => null, close: () => null });
  const bottomDrawerHeight = windowHeight / 2;
  const { colors } = useTheme();
  const [formIsValid, setFormIsValid] = useState(false);
  const [helperText, setHelperText] = useState(null);
  const [activity, setActivity] = useState(null);
  const initialDate = new Date();
  initialDate.setHours(initialDate.getHours() - 1);

  const [date, setDate] = useState<Date>(initialDate);
  const [duration, setDuration] = useState("0 min");
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const { openModal } = useModal();

  function resetForm() {
    setActivity(null);
    setDate(new Date());
    setDuration("0 min");
    setDistance(0);
    setSpeed(0);
    setFormIsValid(false);
  }

  function checkIfFormIsValid() {
    if (activity !== null) {
      if (duration !== "0 min") {
        setFormIsValid(true);
        setHelperText(null);
      } else {
        setFormIsValid(false);
        setHelperText("Activity must be longer than 0 min");
      }
    } else {
      if (duration === "0 min") {
        setFormIsValid(false);
        setHelperText(null);
      } else {
        setFormIsValid(false);
        setHelperText("Select an Activity Type");
      }
    }
  }

  interface ActivityType {
    type: string;
    alias: string;
    element: PrimaryElement;
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
    //console.log(distance, typeof distance, totalMeters, speed, typeof speed, averageMetersPerSecond, duration, totalSeconds);

    const dateWithOffset = calculateOffSet(date);
    console.log(date, dateWithOffset);
    const newManualActivity = {
      source: "herofit",
      type: activity,
      activityDate: dateWithOffset,
      averageSpeed: roundNumberToThousandthReturnNumber(averageMetersPerSecond),
      maxSpeed: roundNumberToTenthReturnNumber(averageMetersPerSecond),
      distance: roundNumberToTenthReturnNumber(totalMeters),
      duration: totalSeconds,
      elevationGain: 0,
    };

    resetForm();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Home",
          params: { newManualActivity },
        },
      ],
    });
  }

  useEffect(() => {
    checkIfFormIsValid();
  }, [activity, duration]);

  return (
    <ScreenContainer screenName={route.name}>
      <View justifyContent="flex-start">
        <Center>
          <Header text="Activity" />
        </Center>
        <Pane>
          <Subheader fontSize="lg" text="Manually record a workout you've completed" />
          {/* ALL INPUTS */}
          <VStack space={2}>
            {/* Activity Type Input */}
            <PressableInput ml={2} mr={2} value={activityList.find(act => act.type === activity)?.alias} placeholder="Select Activity" action={() => refRBSheet.current.open()} />

            {/* Date - Time - Duration Input */}
            <DateTimeDuration
              setParentDate={setDate}
              initialDate={initialDate}
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
            {helperText && <HelperText type="error" text={helperText} />}
          </VStack>
        </Pane>
      </View>

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

      {/* Duration Wheel Selector Modal */}
      <DurationModal id="DurationModal" title="Duration" modalAction={setDuration} duration={duration} />

      {/* Distance Wheel Selector Modal */}
      <DistanceModal id="DistanceModal" title="Distance" modalAction={setDistance} distance={distance} />

      {/* Speed Wheel Selector Modal */}
      <SpeedModal id="SpeedModal" title="Speed" modalAction={setSpeed} speed={speed} />

      <ScreenActionButton disabled={!formIsValid} text="Apply Activity to Hero" action={() => handleSubmit(activity, date, duration, distance, speed)} />
    </ScreenContainer>
  );
};

export default ManualActivity;
