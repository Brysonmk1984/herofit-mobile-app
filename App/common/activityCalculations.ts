import moment from "moment";
import { Icon } from "../Components/CustomComponents";
import { thousandsFormat } from "./helperFunctions";
import { Activity, PrimaryElement } from "./types";

// FOR SAVING TO DB
function convertMilesToMeters(miles: number) {
  return miles * 1609.34;
}
function convertMilesHoursToMetersSeconds(mph: number) {
  return mph * 0.44704;
}

function convertDurationStringToSeconds(duration: string) {
  let hours = 0;
  let minutes = 0;
  if (duration.includes("hrs")) {
    if (duration.includes("min")) {
      // HRS & MIN
      const parts = duration.split(",");
      hours = parseInt(parts[0]);
      minutes = parseInt(parts[1]);
    } else {
      // JUST HRS
      hours = parseInt(duration.split("hrs")[0]);
    }
  } else {
    // JUST MIN
    minutes = parseInt(duration.split("min")[0]);
  }
  // prettier-ignore
  return ((hours * 60 * 60) + (minutes * 60));
}

// FOR DISPLAYING
function convertMetersToFeet(meters: number) {
  return meters ? `${thousandsFormat((meters * 3.28084).toFixed(0))} ft` : null;
}

function convertMetersToMiles(distance: number) {
  return distance ? `${(distance * 0.000621371).toFixed(2)} mi` : null;
}

function convertMetersSecondsToMilesHours(mps: number) {
  return mps ? `${(mps * 2.2369).toFixed(1)} mph` : null;
}

function convertSecondsToReadableTime(sec: number) {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);

  const readableHours = hours ? `${hours} hr` : ``;
  const readableMin = minutes ? ` ${minutes} min` : ``;
  const comma = readableHours && readableMin ? `,` : ``;
  const readableTime = readableHours + comma + readableMin;
  return readableTime;
}

function calculateOffSet(date: Date) {
  const offsetInMin = moment(date).utcOffset();
  return moment().utcOffset(offsetInMin, true);
}

interface IncludedColumns {
  hasDistance: boolean;
  hasAverageSpeed: boolean;
  hasMaxSpeed: boolean;
  hasElevationGain: boolean;
}

function checkForDistanceColumns(activityData: Activity[], includedColumns: IncludedColumns) {
  activityData.forEach(act => {
    if (act.distance) {
      includedColumns.hasDistance = true;
    }
    if (act.averageSpeed) {
      includedColumns.hasAverageSpeed = true;
    }
    if (act.maxSpeed) {
      includedColumns.hasMaxSpeed = true;
    }
    if (act.elevationGain) {
      includedColumns.hasElevationGain = true;
    }
  });
  return includedColumns;
}

// function determineActivityIcon(type){
//   switch(type){
//     case 'Yoga':
//       return <Icons.Yoga />
//       break;
//     case 'Walk':
//       return <Icons.Walk />
//       break;
//     case 'Ride':
//     case 'VirtualRide':
//       return <Icons.Ride />
//       break;
//     case 'Hike':
//       return <Icons.Hike />
//       break;
//     case 'WeightTraining':
//       return <Icons.Weights />
//       break;
//     case 'Run':
//     case 'VirtualRun':
//       return <Icons.Run />
//       break;
//     case 'StairStepper':
//       return <Icons.Stairs />
//       break;
//     case 'Elliptical':
//       return <Icons.Elliptical />
//       break;
//     case 'Swim':
//       return <Icons.Swim />
//       break;
//     case 'Rowing':
//       return <Icons.Rowing />
//       break;
//     case 'Crossfit':
//       return <Icons.Crossfit />
//       break;
//     case 'StandUpPaddling':
//       return <Icons.StandUpPaddling />
//       break;
//     case 'Kayaking':
//       return <Icons.Kayaking />
//       break;
//     case 'Snowshoe':
//       return <Icons.Snowshoe />
//     case 'Snowboard':
//       return <Icons.Snowboard />
//     case 'NordicSki':
//     case 'AlpineSki':
//     case 'BackcountrySki':
//       return <Icons.Ski />
//       break;
//     default:
//       return <Icons.Workout style={{"fontSize":".8em"}} />
//   }
// }

function determineElementFromActivity(type: string) {
  switch (type) {
    case "Yoga":
    case "Walk":
    case "Elliptical":
      return "air";
    case "Hike":
    case "WeightTraining":
    case "Ride":
    case "VirtualRide":
      return "earth";
    case "Run":
    case "StairStepper":
    case "Crossfit":
    case "VirtualRun":
      return "fire";
    case "StandUpPaddling":
    case "Swim":
    case "Rowing":
    case "Kayaking":
    case "NordicSki":
    case "AlpineSki":
    case "BackcountrySki":
    case "Snowboard":
    case "Snowshoe":
      return "water";
    default:
      return "workout";
  }
}

function calculateXPBonus(sec: number, isTimeAndHalfActivity: boolean) {
  const xp = isTimeAndHalfActivity ? (sec / 60) * 1.5 : sec / 60;
  return Math.floor(xp);
}

function calculatePowerBonus(sec: number, isTimeAndHalfActivity: boolean) {
  const min = sec / 60;
  const power = isTimeAndHalfActivity ? (min / 20).toFixed(1) : (min / 30).toFixed(1);
  return power;
}

function calculateElementBonus(sec: number, allElements: boolean, isTimeAndHalfActivity: boolean) {
  const min = sec / 60;
  const hours = min / 60;
  let num: number;
  if (allElements) {
    num = min / 30 / 4;
  } else if (isTimeAndHalfActivity) {
    num = min / 20;
  } else {
    num = min / 30;
  }

  if (hours < 1) {
    //return `${(Math.floor((min /60).toFixed(1)/10)*10).replace(/^0+/, "")}`
    return (Math.floor(10 * num) / 10).toString().replace(/^0+/, "");
  }
  return (Math.floor(10 * num) / 10).toString();
}

export { convertMilesToMeters, convertMilesHoursToMetersSeconds, convertDurationStringToSeconds, convertMetersToFeet, convertMetersToMiles, convertMetersSecondsToMilesHours, convertSecondsToReadableTime, calculateOffSet, checkForDistanceColumns, calculateXPBonus, calculatePowerBonus, calculateElementBonus, determineElementFromActivity };
