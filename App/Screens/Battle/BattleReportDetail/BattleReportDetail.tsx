import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { View, Text, useTheme, Box, Center, VStack, HStack, ScrollView } from "native-base";
import { MainStackProps } from "../../../common/types-navigator";
import { Header, Icon, ScreenContainer, Subheader } from "../../../Components/CustomComponents";
import { LinearGradient } from "expo-linear-gradient";
import { determineScenario } from "../../../common/helperFunctions";
import moment from "moment";
import { Table, TableWrapper, Row, Rows, Col } from "react-native-table-component";
import herofitTheme from "../../../styles/herofitTheme";
import { BattleEffectProc, BattleReportStats, BattleSeasonalBonusElement } from "../../../common/types-battle";
import { borderWidth } from "styled-system";
import { Swipeable } from "react-native-gesture-handler";
import StatDisplay from "./StatDisplay";
import RoundDisplay from "../BattleReportRounds.tsx/RoundDisplay";
import SpiralBackground from "../SpiralBackground";
import SwipeForNextScreen from "../SwipeForNextScreen";

const BattleReportDetail: React.FC<MainStackProps<"BattleReportDetail">> = ({ navigation, route }) => {
  const { outcome } = route.params.battleReport;

  return (
    <ScreenContainer screenName={route.name} bg={<SpiralBackground outcome={outcome} />}>
      <ScrollView>
        <VStack>
          <Header text={"Battle Report"} extraPadding={false} mt={-7} mb={-4} />
          <StatDisplay battleReport={route.params.battleReport} />
        </VStack>
      </ScrollView>
      <SwipeForNextScreen center={true} />
    </ScreenContainer>
  );
};
export default BattleReportDetail;
