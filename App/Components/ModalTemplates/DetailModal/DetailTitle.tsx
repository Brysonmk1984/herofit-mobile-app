import React from "react";
import { Text, Center, Box } from "native-base";

interface DetailTitleProps {
  title: string;
  bgColor?: string;
  characterColors?: [string, string];
}

const DetailTitle: React.FC<DetailTitleProps> = ({ title, subtitle, bgColor = "base.secondary", characterColors }) => {
  return (
    <Box>
      <Center justifyContent="center" bgColor={characterColors ? characterColors[0] : bgColor} py={2}>
        <Text flexWrap="wrap" color={characterColors ? characterColors[1] : "white"} textAlign="center" fontSize={title.length > 30 ? "xl" : title.length > 25 ? "2xl" : "3xl"} fontFamily="heading">
          {title}
        </Text>
      </Center>
      <Center justifyContent="center" bgColor={characterColors ? characterColors[1] : "primary.600"} py={1}>
        <Text flexWrap="wrap" color={"base.white"} textAlign="center" fontSize={title.length > 30 ? "sm" : title.length > 25 ? "md" : "lg"} fontFamily="heading">
          {subtitle}
        </Text>
      </Center>
    </Box>
  );
};

export default DetailTitle;
