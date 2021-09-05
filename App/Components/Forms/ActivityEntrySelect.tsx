import React, { useState } from "react";
import { Box, FormControl, Radio, Text, VStack } from "native-base";

interface ActivityEntrySelectProps {
  activityRadioValue: string;
  setActivityRadioValue: (activity: string) => void;
}

export const ActivityEntrySelect: React.FC<ActivityEntrySelectProps> = ({ activityRadioValue, setActivityRadioValue }) => {
  return (
    <Box px={2}>
      <FormControl>
        <Radio.Group
          name="activityEntryOptions"
          accessibilityLabel="Activity Entry Options"
          value={activityRadioValue}
          onChange={nextValue => {
            setActivityRadioValue(nextValue);
          }}
          width={"100%"}
        >
          <Radio value="Manual" my={1} _text={{ fontSize: "sm" }} alignSelf={"flex-start"}>
            <VStack pl={2} space={1} maxWidth="90%" alignSelf={"flex-start"}>
              <Text fontWeight="bold">Manual Mode</Text>
              <Text fontSize="sm" opacity={0.4}>
                Enter Activities from within HeroFit
              </Text>
            </VStack>
          </Radio>
          <Radio value="Strava" my={1} _text={{ fontSize: "sm" }} alignSelf={"flex-start"}>
            <VStack px={2} space={1}>
              <Text fontWeight="bold" color="base.strava">
                Strava<Text fontWeight="bold"> + Manual Mode</Text>
              </Text>

              <Text fontSize="sm" opacity={0.4} maxWidth="90%">
                Let HeroFit Automatically get your Strava activities (requires a Strava account)
              </Text>
            </VStack>
          </Radio>
        </Radio.Group>
      </FormControl>
    </Box>
  );
};
