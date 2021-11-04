import React from "react";
import { Box, Text, Image } from "native-base";
import { HeroImage } from "./HeroImage/HeroImage";
import { getColorFromClassName, getColorFromItemName, getPetImage } from "../common/helperFunctions";
import { Item, CharacterName, ItemWithOwnership } from "../common/types";
import Icon from "./Icon";

interface getItemImageProps {
  item: Item | ItemWithOwnership;
  w?: number;
  style?: object | any[];
  character?: CharacterName;
  // Change color of default icon color
  reverseIconDefaultColor?: boolean;
}

const ItemImage: React.FC<getItemImageProps> = ({ item, w, style, character, reverseIconDefaultColor }) => {
  function getItemImage(item: Item, character?: CharacterName) {
    switch (item.type) {
      //Get Hero Image
      case "skin":
        if (!w || !character) {
          throw new Error("Must pass width and character name");
        }
        return <HeroImage character={character} width={w} height={w} skin={item} />;
      // Get Item Image
      case "pet":
        return <Image style={style} source={getPetImage(item.name)} alt={item.name} resizeMode="contain" w={w} h={w} />;
      // Get Icon as Image
      case "title":
      case "consumable":
      case "codex":
        if (!w) {
          throw new Error("Must pass width");
        }
        const iconColor = item.class ? getColorFromClassName(item.class) : getColorFromItemName(item.name, reverseIconDefaultColor);
        return (
          <Box alignItems="center">
            <Icon iconName={item.name} size={w} color={iconColor} />
          </Box>
        );

      // No matching item type, throw error
      default:
        throw new Error("No Item of that type");
    }
  }

  return getItemImage(item, character);
};

export default ItemImage;
