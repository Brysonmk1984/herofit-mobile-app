import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { View, Text, useTheme, Box, Center, VStack, HStack, ScrollView } from "native-base";
import { MainStackProps } from "../../../common/types-navigator";
import { Header, Icon, ScreenContainer, Subheader } from "../../../Components/CustomComponents";
import RoundDisplay from "./RoundDisplay";
import SpiralBackground from "../SpiralBackground";
import SwipeForNextScreen from "../SwipeForNextScreen";
import { Stat } from "../../../common/types";
import AttributeDetail from "../../../Components/Modals/AttributeDetail";

const BattleReportDetail: React.FC<MainStackProps<"BattleReportDetail"> & { setSelectedAttribute: (attribute: Lowercase<Stat>, selectedAttribute: Lowercase<Stat> | null) => void }> = ({ navigation, route, selectedAttribute, setSelectedAttribute }) => {
  const { battleReport } = route.params;

  return (
    <ScreenContainer screenName={route.name} bg={<SpiralBackground outcome={battleReport.outcome} />}>
      <ScrollView>
        <Header text={"Battle Report"} extraPadding={false} mt={-7} />
        <RoundDisplay battleReport={route.params.battleReport} setSelectedAttribute={setSelectedAttribute} />
      </ScrollView>
      <SwipeForNextScreen reversedText={battleReport.outcome !== "Avatar Wins"} center={true} />
      {selectedAttribute && <AttributeDetail id="AttributeDetail" attribute={selectedAttribute} />}
    </ScreenContainer>
  );
};
export default BattleReportDetail;
