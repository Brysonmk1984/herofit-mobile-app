import React, { useContext, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Center, Heading, Box, HStack, VStack, Text, ScrollView, FlatList, View, useTheme, Input, Pressable, Modal, Button } from "native-base";
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
import { checkDataSrcType, roundNumberToTenthReturnNumber, roundNumberToThousandthReturnNumber } from "../../common/helperFunctions";
import StravaPane from "./StravaPane";
import HistoryPane from "./HistoryPane";
import useDidMount from "../../common/hooks/useDidMount";
import customIconActivityTypes from "../../common/customIconActivityTypes";

const Activity = ({ route, navigation }: AuthStackProps<"Activity">) => {
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
  const { state } = useContext(GlobalStateContext);
  const isStravaUser = "strava" === checkDataSrcType(state.user.dataSrcId);
  const [showDateTimeWheel, setShowDateTimeWheel] = useState(false);

  // Used to speed up inital screen rendering
  const { mounted } = useDidMount();
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
        }}
        flexDirection="row"
      >
        <Icon color={`base.${act.element}`} iconName={act.type} size={customIconActivityTypes.includes(act.type) ? 35 : 10} />
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
    console.log(distance, typeof distance, totalMeters, speed, typeof speed, averageMetersPerSecond, duration, totalSeconds);

    const dateWithOffset = calculateOffSet(date);
    //console.log(date, dateWithOffset);
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

  function handleModalOpening(modalName: string) {
    setShowDateTimeWheel(false);
    openModal(modalName);
  }

  useEffect(() => {
    checkIfFormIsValid();
  }, [activity, duration]);

  useEffect(() => {
    if (activity) {
      refRBSheet.current.close();
    }
  }, [activity]);

  return (
    <ScreenContainer screenName={route.name}>
      <Header text="Activity" />
      <ScrollView>
        <Pane mb={10} mt={5}>
          <Subheader fontSize="lg" text="Manually record a workout you've completed" />
          {/* ALL INPUTS */}
          <VStack space={2}>
            {/* Activity Type Input */}
            <PressableInput ml={2} mr={2} value={activityList.find(act => act.type === activity)?.alias} placeholder="Select Activity" action={() => refRBSheet.current.open()} />

            {/* Date - Time - Duration Input */}
            <DateTimeDuration
              initialDate={initialDate}
              setShowDateTimeWheel={setShowDateTimeWheel}
              showDateTimeWheel={showDateTimeWheel}
              render={() => {
                return <PressableInput flex={1} ml={2} mr={2} action={() => handleModalOpening("DurationModal")} value={duration} />;
              }}
            />
            <HStack>
              {/* Distance Input */}
              <PressableInput flex={1} ml={2} mr={2} action={() => handleModalOpening("DistanceModal")} value={`${distance} mi`} />
              {/* Speed Input */}
              <PressableInput flex={1} ml={2} mr={2} action={() => handleModalOpening("SpeedModal")} value={`${speed} mph`} />
            </HStack>
            {helperText && <HelperText type="error" text={helperText} />}
          </VStack>
          <Button bgColor={!formIsValid ? "base.disabled" : "base.success"} _text={{ fontFamily: "heading", fontSize: "4xl", lineHeight: 45, color: !formIsValid ? "muted.500" : "base.white" }} _pressed={{ bgColor: "success.300" }} mt={5} disabled={!formIsValid} onPress={() => handleSubmit(activity, date, duration, distance, speed)}>
            APPLY TO HERO
          </Button>
        </Pane>

        {mounted && <HistoryPane navigation={navigation} isStravaUser={isStravaUser} />}

        {isStravaUser && mounted && <StravaPane pop={() => navigation.navigate("Home", { fetchStravaManually: true })} />}
      </ScrollView>

      {/* HIDDEN MENU */}
      {mounted && (
        <Box position="absolute" bottom={0}>
          <View flex={1} justifyContent="center" alignItems="center" bgColor="#000">
            <RBSheet
              ref={refRBSheet}
              closeOnDragDown={true}
              closeOnPressMask={true}
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
              <FlatList borderTopWidth={1} borderTopColor={"primary.500"} data={activityList} renderItem={({ item }) => renderActivityList(item)} keyExtractor={(item, index) => index.toString()} />
            </RBSheet>
          </View>
        </Box>
      )}

      {/* Duration Wheel Selector Modal */}
      {mounted && <DurationModal id="DurationModal" title="Duration" modalAction={setDuration} duration={duration} />}

      {/* Distance Wheel Selector Modal */}
      {mounted && <DistanceModal id="DistanceModal" title="Distance" modalAction={setDistance} distance={distance} />}

      {/* Speed Wheel Selector Modal */}
      {mounted && <SpeedModal id="SpeedModal" title="Speed" modalAction={setSpeed} speed={speed} />}
    </ScreenContainer>
  );
};

export default Activity;
