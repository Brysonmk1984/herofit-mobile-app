import { Foundation, FontAwesome5, Feather, Ionicons, FontAwesome, AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { Icon, useTheme } from "native-base";
import { checkForMultipleItem, lowercaseDash } from "../common/helperFunctions";

// function to keep consistent color value passing in props for both native-base and icomoon icons
function getMatchingThemeColor(color: string, themeColors: string): string {
  // If the passed in color is just a hex or rgb, return it
  if (color.includes("#") || color.includes("rgb")) {
    return color;
  }

  // Otherwise, it's a color from the theme
  const colorParts = color.split(".");
  const colorPartsLength = colorParts.length;

  if (colorPartsLength > 2) {
    throw new Error("Invalid color format");
  } else if (colorPartsLength === 2) {
    return themeColors[colorParts[0]][colorParts[1]];
  } else {
    return themeColors.base[color];
  }
}

// Custom Icon Set loaded from IcoMoon config file.
const IcoMoon = createIconSetFromIcoMoon(require("../../assets/custom-icons.json"), "icomoon", "icomoon.ttf");

interface IconProps {
  iconName: string;
  size: number;
  color: string;
}

// Returns the matching icon based on iconName prop
const InGameIcons = ({ iconName, size, color }: IconProps) => {
  const { colors: themeColors } = useTheme();
  switch (iconName) {
    // ACTIVITIES
    // Fire
    case "run":
    case "Run":
    case "VirtualRun":
      return <Icon as={MaterialCommunityIcons} name="run-fast" size={size} color={color} />;
    // case "crossfit":
    //   return <Icon as={Feather} name="crosshair" size={size} color={color} />;
    case "stairs":
    case "StairStepper":
      return <Icon as={MaterialCommunityIcons} name="stairs" size={size} color={color} />;
    // Air
    case "yoga":
    case "Yoga":
      return <Icon as={MaterialCommunityIcons} name="yoga" size={size} color={color} />;
    case "walk":
    case "Walk":
      return <Icon as={MaterialCommunityIcons} name="walk" size={size} color={color} />;
    case "elliptical":
    case "Elliptical":
      return <Icon as={FontAwesome5} name="running" size={size} color={color} />;
    // Water
    case "rowing":
    case "Rowing":
      return <Icon as={MaterialCommunityIcons} name="rowing" size={size} color={color} />;
    case "swimming":
    case "Swim":
      return <Icon as={FontAwesome5} name="swimmer" size={size - 1} color={color} />;
    case "kayaking":
    case "Kayaking":
      return <Icon as={FontAwesome5} name="water" size={size} color={color} />;
    case "stand-up-paddling":
    case "StandUpPaddling":
      return <Icon as={MaterialCommunityIcons} name="ski-water" size={size} color={color} />;
    case "skiing":
    case "NordicSki":
    case "AlpineSki":
    case "BackcountrySki":
      return <Icon as={FontAwesome5} name="skiing-nordic" size={size} color={color} />;
    case "snowboarding":
    case "Snowboard":
      return <Icon as={FontAwesome5} name="snowboarding" size={size} color={color} />;
    case "snowshoeing":
    case "Snowshoe":
      return <Icon as={FontAwesome5} name="snowflake" size={size} color={color} />;
    // earth
    case "ride":
    case "Ride":
    case "VirtualRide":
      return <Icon as={MaterialCommunityIcons} name="bike-fast" size={size} color={color} />;
    case "weight-lifting":
    case "WeightTraining":
      return <Icon as={MaterialCommunityIcons} name="weight-lifter" size={size} color={color} />;
    case "hiking":
    case "Hiking":
    case "Hike":
      return <Icon as={Foundation} name="mountains" size={size} color={color} />;
    // general workout
    case "workout":
    case "Workout":
    case "other":
      return <Icon as={MaterialCommunityIcons} name="arm-flex" size={size} color={color} />;
    case "success":
      return <Icon as={Ionicons} name="md-checkmark-circle" size={size} color={color} />;
    case "caution":
      return <Icon as={Ionicons} name="md-warning-sharp" size={size} color={color} />;
    case "error":
      return <Icon as={MaterialIcons} name="error" size={size} color={color} />;
    case "info":
      return <Icon as={FontAwesome5} name="info-circle" size={size} color={color} />;
    case "air":
      return <Icon as={FontAwesome5} name="wind" size={size} color={color} />;
    // DEFAULT: ICOMOON ICON OR NONE FOUND
    default:
      // If no icon is explicitly returned above, attempt to find icon from within icomoon custom icon set
      // If no icon is found within the custom icon set, return a question mark to show no icon was found.
      const lcDashName = lowercaseDash(iconName);
      // Need to check if the item is a common item icon is common among multiple icons
      const nameIncludingMultiples = checkForMultipleItem(lcDashName);
      return <IcoMoon name={nameIncludingMultiples} size={size} color={getMatchingThemeColor(color, themeColors)} /> || <Icon as={FontAwesome} name="question-circle" size={size} color={color} />;
  }
};

export default InGameIcons;
