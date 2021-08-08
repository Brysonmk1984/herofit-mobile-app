import { Entypo, Foundation, FontAwesome5, Feather, Ionicons, FontAwesome, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { Icon } from 'native-base';


// Custom Icon Set loaded from IcoMoon config file.
const IcoMoon = createIconSetFromIcoMoon(require('../../assets/custom-icons.json'),'icomoon','icomoon.ttf');

interface IconProps {
  iconName : string;
  size : number;
  color : string;
}

// Returns the matching icon based on iconName prop
const InGameIcons = ({ iconName, size, color } : IconProps) =>{
  
  switch(iconName){
    // ACTIVITIES
    // Fire
    case 'run':
      return <Icon as={FontAwesome5} name="run-fast" size={size} color={color} />
    case 'crossfit':
      return <Icon as={Feather} name="crosshair" size={size} color={color} />
    case 'stairs':
      return <Icon as={MaterialCommunityIcons} name="stairs" size={size} color={color} />
    // Air
    case 'yoga':
      return <Icon as={MaterialCommunityIcons} name="yoga" size={size} color={color} />
    case 'walk':
      return <Icon as={MaterialCommunityIcons} name="walk" size={size} color={color} />
    case 'elliptical':
      return <Icon as={FontAwesome5} name="running" size={size} color={color} />
    // Water
    case 'rowing':
      return <Icon as={MaterialCommunityIcons} name="rowing" size={size} color={color} />
    case 'swimming':
      return <Icon as={FontAwesome5} name="swimmer" size={size} color={color} />
    case 'kayaking':
      return <Icon as={FontAwesome5} name="water" size={size} color={color} />
    case 'stand-up-paddling':
      return <Icon as={MaterialCommunityIcons} name="ski-water" size={size} color={color} />
    case 'skiing':
      return <Icon as={FontAwesome5} name="skiing-nordic" size={size} color={color} />
    case 'snowboarding':
      return <Icon as={FontAwesome5} name="snowboarding" size={size} color={color} />
    case 'snowshoeing':
      return <Icon as={FontAwesome5} name="snowflake" size={size} color={color} />
    // earth
    case 'ride':
      return <Icon as={MaterialCommunityIcons} name="bike-fast" size={size} color={color} />
    case 'weight-lifting':
      return <Icon as={MaterialCommunityIcons} name="weight-lifter" size={size} color={color} />
    case 'hiking':
      return <Icon as={Foundation} name="mountains" size={size} color={color} />
    // general workout
    case 'workout':
      return <Icon as={MaterialCommunityIcons} name="arm-flex" size={size} color={color} />
    
    
    // DEFAULT: ICOMOON ICON OR NONE FOUND
    default:
      // If no icon is explicitly returned above, attempt to find icon from within icomoon custom icon set
      // If no icon is found within the custom icon set, return a question mark to show no icon was found. 
      return <IcoMoon name={iconName} size={size} color={color} /> || <Icon as={FontAwesome} name="question-circle" size={size} color={color} />
  }
}

export default InGameIcons;
