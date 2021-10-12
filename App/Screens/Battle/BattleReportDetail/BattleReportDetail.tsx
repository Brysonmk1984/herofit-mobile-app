import React from "react";
import { ImageBackground, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { View, Text, useTheme, Box, Center, VStack } from "native-base";
import { MainDrawerProps } from "../../../common/types-navigator";
import { ScreenContainer } from "../../../Components/CustomComponents";
import { LinearGradient } from "expo-linear-gradient";
import { determineScenario } from "../../../common/helperFunctions";
import moment from "moment";
import { Table, TableWrapper, Row, Rows, Col } from "react-native-table-component";

const BattleReportDetail: React.FC<MainDrawerProps<"BattleReportDetail">> = ({ navigation, route }) => {
  const { height } = useWindowDimensions();
  const { outcome, scenario, roundBreakdown, avatar, BRA, foe, BRF, foeType, effects, updatedAt, seasonalBonusElement } = route.params.battleReport;
  const { colors } = useTheme();
  const gradient = ["transparent", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "transparent"];
  const backgroundImage = require("../../../../assets/images/backgrounds/battle-report-background.webp");
  console.log(route.params.battleReport);

  return (
    <ScreenContainer screenName={route.name} bgColor={outcome === "Avatar Wins" ? colors.base.highlight : colors.base.lowlight}>
      <VStack zIndex={100} h={height * 0.9} w="100%" justifyContent="center" alignItems="center" position="absolute">
        <LinearGradient colors={gradient} style={styles.vsGradient} />
        <Pressable onPress={route.params.push}>
          <Center>
            <Text>{moment(updatedAt).format("MM-DD-YYYY")}</Text>
          </Center>
          <Center>
            <Text>{determineScenario(scenario).type}</Text>
            <Text>{determineScenario(scenario).description}</Text>
          </Center>
        </Pressable>
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
