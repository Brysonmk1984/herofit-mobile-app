import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Center, Box, HStack } from "native-base";
import { Pressable, View, Button, Platform } from "react-native";
import { onChange } from "react-native-reanimated";
import PressableInput from "../../Components/PressableInput";
import moment from "moment";

interface DateTimeDurationProps {
  render: () => React.ReactChild;
  setParentDate: (date: Date) => void;
  initialDate: Date;
}

const DateTimeDuration: React.FC<DateTimeDurationProps> = ({ render, setParentDate, initialDate }) => {
  //For both date & time
  const [date, setDate] = useState(initialDate);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const platform = Platform.OS;

  const onDateTimeChange = (event, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShow(platform === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode: "date" | "time") => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  useEffect(() => {
    if (date) {
      setShow(false);
    }
  }, [date]);

  return (
    <View>
      <HStack>
        <PressableInput alignItems="center" ml={2} flex={1} value={moment(date).format("MM/DD")} placeholder="Date" action={showDatepicker} />
        <PressableInput alignItems="center" ml={2} mr={2} flex={1} value={moment(date).format("hh:mm A")} placeholder="Time" action={showTimepicker} />
        {/* Rendering the Duration input */}
        {render()}
      </HStack>
      {show && <DateTimePicker display={Platform.OS === "ios" ? "spinner" : "default"} value={date} mode={mode} is24Hour={false} onChange={onDateTimeChange} />}
    </View>
  );
};

export default DateTimeDuration;
