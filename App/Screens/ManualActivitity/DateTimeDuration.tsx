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
}

const DateTimeDuration: React.FC<DateTimeDurationProps> = ({ render, setParentDate }) => {
  //For both date & time
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onDateTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = currentMode => {
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
    setParentDate(date);
  }, [date]);

  return (
    <View>
      <HStack>
        <PressableInput alignItems="center" ml={2} flex={1} value={moment(date).format("MM/DD")} placeholder="Date" action={showDatepicker} />
        <PressableInput alignItems="center" ml={2} mr={2} flex={1} value={moment(date).format("hh:mm A")} placeholder="Time" action={showTimepicker} />
        {/* Rendering the Duration input */}
        {render()}
      </HStack>
      {show && <DateTimePicker value={date} mode={mode} is24Hour={false} display="default" onChange={onDateTimeChange} />}
    </View>
  );
};

export default DateTimeDuration;
