import React from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, useToken } from "native-base";
import { ScreenContainer, Header, Subheader, ScreenActionButton, Pane, Icon } from "../../Components/CustomComponents";

interface LoreTextProps {
  lore: string;
}

export default function LoreText({ lore }: LoreTextProps) {
  const [firstLetterLore] = lore.split("");
  const remainingLore = lore.substring(1);

  return (
    <HStack>
      <Text color="base.brand" fontSize={"4xl"} lineHeight={"40px"} fontFamily={"handwriting"}>
        {firstLetterLore}
      </Text>
      <Text pr={5} fontSize={"xs"}>
        {remainingLore}
      </Text>
    </HStack>
  );
}
