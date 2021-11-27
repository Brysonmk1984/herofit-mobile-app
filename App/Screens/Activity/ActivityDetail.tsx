import React from "react";
import { HStack, Text } from "native-base";
import { Activity } from "../../common/types";
import moment from "moment";
import { Icon } from "../../Components/CustomComponents";
import { convertMilesToMeters, convertMilesHoursToMetersSeconds, convertDurationStringToSeconds, convertMetersToFeet, convertMetersToMiles, convertMetersSecondsToMilesHours, convertSecondsToReadableTime, calculateOffSet, checkForDistanceColumns, calculateXPBonus, calculatePowerBonus, calculateElementBonus, determineElementFromActivity } from "../../common/activityCalculations";
import customIconActivityTypes from "../../common/customIconActivityTypes";

interface ActivityDetailProps {
  activity: Activity;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity }) => {
  const { type, activityDate, duration, distance, averageSpeed, maxSpeed, elevationGain, source } = activity;
  const actElement = determineElementFromActivity(type);

  function determineDate(date: string) {
    if (moment(date).isBefore(moment().subtract(7, "days"))) {
      return moment(date).format("DD/MM h:mm A");
    }
    return moment(date).format("ddd h:mm A");
  }
  return (
    <HStack justifyContent="space-between" alignItems="center" space={1} py={1} borderBottomWidth={1} borderBottomColor="base.primary">
      <Text flex={1.5} flexBasis={20} alignSelf="center" fontSize="sm">
        {determineDate(activityDate)}
      </Text>
      <Text flex={1.5} alignItems="center">
        <Icon iconName={type} size={customIconActivityTypes.includes(type) ? 21 : 6} color={`base.${actElement}`} />
      </Text>
      <Text flex={1} textAlign="right" alignSelf="center" fontSize="sm">
        {convertSecondsToReadableTime(duration)}
      </Text>
      <Text flex={1} textAlign="right" alignSelf="center" fontSize="sm">
        {convertMetersToMiles(distance)}
      </Text>
      <Text flex={0.8} textAlign="right" alignSelf="center" fontSize="sm">
        {convertMetersSecondsToMilesHours(averageSpeed)}
      </Text>
      <Text flex={0.8} textAlign="right" alignSelf="center" fontSize="sm">
        {convertMetersSecondsToMilesHours(maxSpeed)}
      </Text>
      <Text flex={0.8} textAlign="right" alignSelf="center" fontSize="sm">
        {convertMetersToFeet(elevationGain)}
      </Text>
      {/* <Text flex={1} fontSize="sm">
         {calculateElementBonus(duration, allElements, isTimeAndHalfActivity)}
        <Icon iconName={actElement} size={6} color={`base.${actElement}`} />
      </Text> */}
    </HStack>
  );
};

export default ActivityDetail;
