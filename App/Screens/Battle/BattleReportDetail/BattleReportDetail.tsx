import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { View, Text, useTheme, Box, Center, VStack, HStack, ScrollView } from "native-base";
import { MainDrawerProps } from "../../../common/types-navigator";
import { Icon, ScreenContainer } from "../../../Components/CustomComponents";
import { LinearGradient } from "expo-linear-gradient";
import { determineScenario } from "../../../common/helperFunctions";
import moment from "moment";
import { Table, TableWrapper, Row, Rows, Col } from "react-native-table-component";
import herofitTheme from "../../../styles/herofitTheme";
import { BattleEffectProc, BattleReportStats, BattleSeasonalBonusElement } from "../../../common/types-battle";
import { borderWidth } from "styled-system";
import { Swipeable } from "react-native-gesture-handler";
import StatDisplay from "./StatDisplay";
import RoundDisplay from "./RoundDisplay";

const BattleReportDetail: React.FC<MainDrawerProps<"BattleReportDetail">> = ({ navigation, route }) => {
  const { height } = useWindowDimensions();
  const { outcome, scenario, roundBreakdown, avatar: hero, bra: brh, foe, brf, foeType, effects, updatedAt, seasonalBonusElement, effectProcs } = route.params.battleReport;
  const { colors } = useTheme();
  const gradient = ["transparent", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "transparent"];
  const backgroundImage = require("../../../../assets/images/backgrounds/battle-report-background.webp");
  const [showFirstScreen, setShowFirstScreen] = useState(true);

  function nextPage() {
    if (showFirstScreen) {
      setShowFirstScreen(false);
    } else {
      navigation.push("App");
    }
  }

  return (
    <ScreenContainer screenName={route.name} bgColor={outcome === "Avatar Wins" ? colors.base.highlight : colors.base.lowlight}>
      <VStack zIndex={100} h={height * 0.9} w="100%" justifyContent="center" alignItems="center" position="absolute">
        <LinearGradient colors={gradient} style={styles.vsGradient} />
        <View w="100%" h="100%">
          {showFirstScreen ? <StatDisplay battleReport={route.params.battleReport} /> : <RoundDisplay battleReport={route.params.battleReport} />}
          <View position="absolute" bottom={20} w="100%">
            <Center>
              <Pressable onPress={nextPage}>
                <Text color="base.link" fontFamily="heading" fontSize={30}>
                  {showFirstScreen ? "Next" : "Done"}
                </Text>
              </Pressable>
            </Center>
          </View>
        </View>
      </VStack>
      <ImageBackground style={styles.backgroundImage} source={backgroundImage} resizeMode="stretch" opacity={0.6} />
    </ScreenContainer>
  );
};
export default BattleReportDetail;

const styles = StyleSheet.create({
  backgroundImage: { position: "absolute", width: "100%", height: "100%", zIndex: 0 },
  vsGradient: { height: "100%", width: "100%", position: "absolute" },
});
