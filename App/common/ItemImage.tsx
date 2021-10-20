import React from "react";
import { Box, Text, Image } from "native-base";
import { HeroImage } from "../Components/HeroImage/HeroImage";
import { getColorFromClassName, getColorFromItemName, getPetImage } from "./helperFunctions";
import { Item, CharacterName, ItemWithOwnership } from "./types";
import Icon from "../Components/Icon";

interface getItemImageProps {
  item: Item | ItemWithOwnership;
  w?: number;
  style?: object | any[];
  character?: CharacterName;
}

const ItemImage: React.FC<getItemImageProps> = ({ item, w, style, character }) => {
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
        return <Image style={style} source={getPetImage(item.name)} alt={item.name} resizeMode="contain" />;
      // Get Icon as Image
      case "title":
      case "consumable":
      case "codex":
        if (!w) {
          throw new Error("Must pass width");
        }
        const iconColor = item.class ? getColorFromClassName(item.class) : getColorFromItemName(item.name, true);
        return (
          <Box>
            <Text textAlign="center">
              <Icon iconName={item.name} size={w} color={iconColor} />
            </Text>
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
