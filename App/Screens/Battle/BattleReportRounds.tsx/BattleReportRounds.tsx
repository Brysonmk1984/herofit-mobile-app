import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { View, Text, useTheme, Box, Center, VStack, HStack, ScrollView } from "native-base";
import { MainStackProps } from "../../../common/types-navigator";
import { Header, Icon, ScreenContainer, Subheader } from "../../../Components/CustomComponents";
import RoundDisplay from "./RoundDisplay";
import SpiralBackground from "../SpiralBackground";
import SwipeForNextScreen from "../SwipeForNextScreen";

const BattleReportDetail: React.FC<MainStackProps<"BattleReportDetail">> = ({ navigation, route }) => {
  const { outcome } = route.params.battleReport;

  return (
    <ScreenContainer screenName={route.name} bg={<SpiralBackground outcome={outcome} />}>
      <ScrollView>
        <Header text={"Battle Report"} extraPadding={false} mt={-7} />
        <RoundDisplay battleReport={route.params.battleReport} />
      </ScrollView>
      <SwipeForNextScreen center={true} />
    </ScreenContainer>
  );
};
export default BattleReportDetail;
