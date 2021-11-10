import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { View, Text, useTheme, Box, Center, VStack, HStack, ScrollView } from "native-base";
import { MainStackProps } from "../../../common/types-navigator";
import { Header, Icon, ScreenContainer, Subheader } from "../../../Components/CustomComponents";
import RoundDisplay from "./RoundDisplay";
import SpiralBackground from "../SpiralBackground";

const BattleReportDetail: React.FC<MainStackProps<"BattleReportDetail">> = ({ navigation, route }) => {
  const { outcome } = route.params.battleReport;

  return (
    <ScreenContainer screenName={route.name} bg={<SpiralBackground outcome={outcome} />}>
      <VStack>
        <Header text={"Battle Report"} />
        <RoundDisplay battleReport={route.params.battleReport} />
      </VStack>
    </ScreenContainer>
  );
};
export default BattleReportDetail;
