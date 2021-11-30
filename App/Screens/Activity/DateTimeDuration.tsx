import React, { useState, useEffect, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HStack } from "native-base";
import { View, Platform } from "react-native";
import PressableInput from "../../Components/PressableInput";
import moment from "moment";

interface DateTimeDurationProps {
  render: () => React.ReactChild;
  initialDate: Date;
  showDateTimeWheel: boolean;
  setShowDateTimeWheel: (showDateTimeWheel: boolean) => void;
}

const DateTimeDuration: React.FC<DateTimeDurationProps> = ({ render, initialDate, showDateTimeWheel, setShowDateTimeWheel }) => {
  //For both date & time
  const [date, setDate] = useState(initialDate);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const oneWeekAgo = moment().subtract(1, "week").toDate();
  const tomorrow = moment().add(1, "day").toDate();

  const platform = Platform.OS;

  const onDateTimeChange = (event, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShow(platform === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode: "date" | "time") => {
    setShow(true);
    setMode(currentMode);
    setShowDateTimeWheel(true);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  // Needed to control hiding the date time wheel from parent component when a user presses on one of the inputs besides Date / Time
  useEffect(() => {
    if (showDateTimeWheel === false) {
      setShow(false);
    }
  }, [showDateTimeWheel]);

  return (
    <View>
      <HStack>
        <PressableInput alignItems="center" ml={2} flex={1} value={moment(date).format("MM/DD")} placeholder="Date" action={showDatepicker} />
        <PressableInput alignItems="center" ml={2} mr={2} flex={1} value={moment(date).format("hh:mm A")} placeholder="Time" action={showTimepicker} />
        {/* Rendering the Duration input */}
        {render()}
      </HStack>
      {show && <DateTimePicker minimumDate={oneWeekAgo} maximumDate={tomorrow} display={Platform.OS === "ios" ? "spinner" : "default"} value={date} mode={mode} is24Hour={false} onChange={onDateTimeChange} />}
    </View>
  );
};

export default DateTimeDuration;
