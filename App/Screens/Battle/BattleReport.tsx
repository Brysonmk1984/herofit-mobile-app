import { exportDefaultSpecifier } from "@babel/types";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "native-base";
import PagerView from "react-native-pager-view";
import BattleReportOutcome from "./BattleReportOutcome/BattleReportOutcome";
import BattleReportDetail from "./BattleReportDetail/BattleReportDetail";
import BattleReportRounds from "./BattleReportRounds.tsx/BattleReportRounds";
import { updateBattleReportSeen } from "../../api/battle";
import { GlobalStateContext } from "../../store";

interface BattleReportProps {}

const BattleReport: React.FC<BattleReportProps> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { id } = route.params.battleReport;
  const [currentPage, setCurrentPage] = useState(1);
  const [secondaryLoading, setSecondaryLoading] = useState(false);

  function handleFinish(e) {
    setCurrentPage(e.nativeEvent.position);
  }

  function handleFirstAndLastSwipes(e) {
    if (currentPage === 4) {
      navigation.popToTop();
    } else if (currentPage === 0) {
      navigation.popToTop();
    }
  }

  useEffect(() => {
    updateBattleReportSeen({ id });
    dispatch({ type: "SEEN BATTLE REPORT", payload: { latestBattle: { ...route.params.battleReport, seenReport: true } } });
  }, []);

  useEffect(() => {
    setSecondaryLoading(true);
  }, []);

  return (
    <PagerView style={styles.pagerView} initialPage={currentPage} onPageSelected={e => handleFinish(e)} onPageScrollStateChanged={e => handleFirstAndLastSwipes(e)} overdrag={true}>
      <View key="1" bgColor="#000"></View>

      <View key="2">
        <BattleReportOutcome navigation={navigation} route={route} />
      </View>
      <View key="3">{secondaryLoading && <BattleReportDetail navigation={navigation} route={route} />}</View>
      <View key="4">{secondaryLoading && <BattleReportRounds navigation={navigation} route={route} />}</View>
      <View key="5" bgColor="#000"></View>
    </PagerView>
  );
};

export default BattleReport;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});
