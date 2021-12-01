import React from "react";
import { Box, View, Text, HStack, VStack } from "native-base";
import Icon from "./Icon";
import { Stat } from "../common/types";

type nativeBaseSizes = number | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";

interface StatDisplaySizes {
  iconSize: number;
  valueSize: nativeBaseSizes;
  statSize: number;
  statSize2: number;
  descriptionSize: nativeBaseSizes;
}

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
  reverseOrder?: boolean;
}

export default function StatDisplay({ stat, value, description, size, reversedText, iconWatermark, flex, statColor, reverseOrder = false }: StatDisplayProps) {
  const elementNameLC = stat.toLowerCase() as Stat;
  const iconColor = iconWatermark ? "base.primary" : `base.${elementNameLC}`;
  const numberColor = statColor ? statColor : reversedText ? "base.white" : "base.primary";
  const textColor = reversedText ? "base.white" : "base.primary";

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
      iconSize = 140;
      statSize = 60;
      statSize2 = 60;
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
      const darkBackgroundStats = ["armor", "health", "power", "recovery"];
      return (
        <View position="absolute" left={"45%"} width="100%" height="100%" overflow="hidden" opacity={0.4}>
          <Box mt={-2}>
            <Icon iconName={stat} size={iconSize} color={darkBackgroundStats.includes(stat) ? "base.white" : iconColor} />
          </Box>
        </View>
      );
    }
    return (
      <View px={1}>
        <Icon iconName={stat} size={iconSize} color={iconColor} />
      </View>
    );
  }

  function renderNumberAndName(iconWatermark: boolean, stat: Stat): React.ReactElement {
    if (iconWatermark) {
      return (
        <View flex={2} alignItems="center">
          <Text color={numberColor} fontFamily="heading" fontSize={value >= 100 ? statSize2 : statSize} textAlign="center" lineHeight={size === "sm" ? "60px" : "80px"}>
            {value}
          </Text>
          <Text textAlign="center" color={"base.highlight"} fontFamily="heading" fontSize={valueSize} mt={-5}>
            {stat}
          </Text>
        </View>
      );
    }

    return (
      <VStack space={0} justifyContent="center">
        <View alignItems="center">
          <Text color={numberColor} fontFamily="heading" fontSize={value >= 100 ? statSize2 : statSize} textAlign="center" lineHeight={size === "sm" ? "40px" : "70px"}>
            {value}
          </Text>
        </View>
        <View mt={-4} alignItems="center">
          <Text color={numberColor} fontFamily="heading" textAlign="center">
            {stat}
          </Text>
        </View>
      </VStack>
    );
  }

  function renderDescription(iconWatermark: boolean, stat: Stat, description: string): React.ReactElement {
    if (!description) {
      return null;
    }
    if (iconWatermark) {
      return (
        <View alignItems={"flex-start"} flex={4}>
          <Text opacity={0.8} color={textColor} fontSize={descriptionSize}>
            {description}
          </Text>
        </View>
      );
    }
    return (
      <View alignItems={"center"} mt={-4}>
        <Text color={textColor} textAlign="justify" fontSize={descriptionSize}>
          {description}
        </Text>
      </View>
    );
  }

  function renderComponents(c1, c2, reversed: boolean) {
    if (reversed) {
      return (
        <>
          {c2}
          {c1}
        </>
      );
    }
    return (
      <>
        {c1}
        {c2}
      </>
    );
  }

  return (
    <Box display="flex" flex={flex}>
      <HStack space={0} alignItems="center" justifyContent="center">
        {renderComponents(renderIcon(iconWatermark, elementNameLC), renderNumberAndName(iconWatermark, elementNameLC), reverseOrder)}
        {description && renderDescription(iconWatermark, elementNameLC, description)}
      </HStack>
    </Box>
  );
}
