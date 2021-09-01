import React from "react";
import { Center, Heading, Text, Divider } from "native-base";

interface Subheader {
  text: string;
  mb?: number;
  mt?: number;
  color?: string;
  fontSize?: number | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  fontFamily?: "heading" | "body" | "handwriting" | "cursive";
}

export default function Subheader({ text, mt = 3, mb = 3, color, fontSize = "3xl", fontFamily = "heading" }: Subheader) {
  return (
    <Center mt={mt} mb={mb}>
      <Heading>
        <Text color={color} fontFamily={fontFamily} fontSize={fontSize}>
          {text}
        </Text>
      </Heading>
      <Divider variant="subheaderDivider" />
    </Center>
  );
}
