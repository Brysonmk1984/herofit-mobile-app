import { Foundation, FontAwesome5, Feather, Ionicons, FontAwesome, AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { Icon, useTheme } from "native-base";

// function to keep consistent color value passing in props for both native-base and icomoon icons
function getMatchingThemeColor(color: string, themeColors: string): string {
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
      return <Icon as={MaterialCommunityIcons} name="run-fast" size={size} color={color} />;
    case "crossfit":
      return <Icon as={Feather} name="crosshair" size={size} color={color} />;
    case "stairs":
      return <Icon as={MaterialCommunityIcons} name="stairs" size={size} color={color} />;
    // Air
    case "yoga":
      return <Icon as={MaterialCommunityIcons} name="yoga" size={size} color={color} />;
    case "walk":
      return <Icon as={MaterialCommunityIcons} name="walk" size={size} color={color} />;
    case "elliptical":
      return <Icon as={FontAwesome5} name="running" size={size} color={color} />;
    // Water
    case "rowing":
      return <Icon as={MaterialCommunityIcons} name="rowing" size={size} color={color} />;
    case "swimming":
      return <Icon as={FontAwesome5} name="swimmer" size={size} color={color} />;
    case "kayaking":
      return <Icon as={FontAwesome5} name="water" size={size} color={color} />;
    case "stand-up-paddling":
      return <Icon as={MaterialCommunityIcons} name="ski-water" size={size} color={color} />;
    case "skiing":
      return <Icon as={FontAwesome5} name="skiing-nordic" size={size} color={color} />;
    case "snowboarding":
      return <Icon as={FontAwesome5} name="snowboarding" size={size} color={color} />;
    case "snowshoeing":
      return <Icon as={FontAwesome5} name="snowflake" size={size} color={color} />;
    // earth
    case "ride":
      return <Icon as={MaterialCommunityIcons} name="bike-fast" size={size} color={color} />;
    case "weight-lifting":
      return <Icon as={MaterialCommunityIcons} name="weight-lifter" size={size} color={color} />;
    case "hiking":
      return <Icon as={Foundation} name="mountains" size={size} color={color} />;
    // general workout
    case "workout":
    case "other":
      return <Icon as={MaterialCommunityIcons} name="arm-flex" size={size} color={color} />;
    case "success":
    case "Success":
      return <Icon as={Ionicons} name="md-checkmark-circle" size={size} color={color} />;
    case "warning":
    case "Warning":
      return <Icon as={Ionicons} name="md-warning-sharp" size={size} color={color} />;
    case "error":
    case "Error":
      return <Icon as={MaterialIcons} name="md-checkmark-circle" size={size} color={color} />;
    case "info":
    case "Info":
      return <Icon as={FontAwesome5} name="info-circle" size={size} color={color} />;
    // DEFAULT: ICOMOON ICON OR NONE FOUND
    default:
      // If no icon is explicitly returned above, attempt to find icon from within icomoon custom icon set
      // If no icon is found within the custom icon set, return a question mark to show no icon was found.
      return <IcoMoon name={iconName} size={size} color={getMatchingThemeColor(color, themeColors)} /> || <Icon as={FontAwesome} name="question-circle" size={size} color={color} />;
  }
};

export default InGameIcons;
