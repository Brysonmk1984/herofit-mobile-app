import React from "react";
import { Box, View, Text, HStack } from "native-base";
import Icon from "./Icon";
import { Stat } from "../common/types";

interface StatDisplayProps {
  stat: Stat;
  value: number;
  description?: string;
  size?: "sm";
  reversedColor?: boolean;
  iconWatermark?: boolean;
  reversedText?: boolean;
  flex?: number;
  statColor?: string;
}

type nativeBaseSizes = number | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";

interface StatDisplaySizes {
  iconSize: number;
  valueSize: nativeBaseSizes;
  statSize: number;
  statSize2: number;
  descriptionSize: nativeBaseSizes;
}

export default function StatDisplay({ stat, value, description, size, reversedText, iconWatermark, flex, statColor }: StatDisplayProps) {
  const elementNameLC = stat.toLowerCase() as Stat;
  const iconColor = reversedText ? "base.white" : `base.${elementNameLC}`;
  const numberColor = statColor ? statColor : reversedText ? "base.white" : null;
  const textColor = reversedText ? "base.white" : null;

  const { iconSize, valueSize, statSize, statSize2, descriptionSize } = ((): StatDisplaySizes => {
    let iconSize = 50,
      valueSize: nativeBaseSizes = "2xl",
      statSize = 50,
      statSize2 = 35,
      descriptionSize: nativeBaseSizes = "sm";

    if (size === "sm") {
      (iconSize = 30), (valueSize = "lg"), (statSize = 30), (statSize2 = 28), (descriptionSize = "xs");
    }
    if (iconWatermark) {
      iconSize = 120;
    }
    return {
      iconSize,
      valueSize,
      statSize,
      statSize2,
      descriptionSize,
    };
  })();

  function renderIcon(iconWatermark: boolean, stat: Stat): React.ReactElement {
    if (iconWatermark) {
      return (
        <View position="absolute" left={"10%"} overflow="hidden" opacity={0.2}>
          <Icon iconName={stat} size={iconSize} color={iconColor} />
        </View>
      );
    }
    return (
      <View>
        <Icon iconName={stat} size={iconSize} color={iconColor} />
      </View>
    );
  }

  function renderNumberAndName(iconWatermark: boolean, stat: Stat): React.ReactElement {
    if (iconWatermark) {
      return (
        <View flex={2} alignItems="center">
          <Text color={numberColor} fontFamily="heading" fontSize={value >= 100 ? statSize2 : statSize} textAlign="center" lineHeight={size === "sm" ? "40px" : "60px"}>
            {value}
          </Text>
          <Text color={textColor} fontFamily="heading" fontSize={valueSize} lineHeight={size === "sm" ? 5 : 6}>
            {stat}
          </Text>
        </View>
      );
    }

    return (
      <View alignItems="center">
        <Text color={numberColor} fontFamily="heading" fontSize={value >= 100 ? statSize2 : statSize} textAlign="center" lineHeight={size === "sm" ? "40px" : "60px"}>
          {value}
        </Text>
        <Text color={textColor} fontFamily="heading" fontSize={valueSize} lineHeight={size === "sm" ? 5 : 6}>
          {stat}
        </Text>
      </View>
    );
  }

  function renderDescription(iconWatermark: boolean, stat: Stat, description: string): React.ReactElement {
    if (!description) {
      return null;
    }
    if (iconWatermark) {
      return (
        <View alignItems={iconWatermark ? "flex-start" : "flex-end"} flex={4}>
          <Text opacity={0.8} color={textColor} fontSize={descriptionSize}>
            {description}
          </Text>
        </View>
      );
    }
    return (
      <View alignItems={iconWatermark ? "flex-start" : "flex-end"} flex={4}>
        <Text color={textColor} textAlign="justify" fontSize={descriptionSize}>
          {description}
        </Text>
      </View>
    );
  }

  return (
    <Box display="flex" flex={flex}>
      <HStack space={2} alignItems="center" justifyContent="center">
        {renderIcon(iconWatermark, elementNameLC)}
        {renderNumberAndName(iconWatermark, elementNameLC)}
        {renderDescription(iconWatermark, elementNameLC, description)}
      </HStack>
    </Box>
  );
}
