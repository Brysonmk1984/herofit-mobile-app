import { exportDefaultSpecifier } from "@babel/types";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "native-base";
import PagerView from "react-native-pager-view";
import BattleReportOutcome from "./BattleReportOutcome/BattleReportOutcome";
import BattleReportDetail from "./BattleReportDetail/BattleReportDetail";
import BattleReportRounds from "./BattleReportRounds.tsx/BattleReportRounds";

interface BattleReportProps {}

const BattleReport: React.FC<BattleReportProps> = ({ navigation, route }) => {
  const [currentPage, setCurrentPage] = useState(1);
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

  return (
    <PagerView style={styles.pagerView} initialPage={currentPage} onPageSelected={e => handleFinish(e)} onPageScrollStateChanged={e => handleFirstAndLastSwipes(e)} overdrag={true}>
      <View key="1" bgColor="#000"></View>
      <View key="2">
        <BattleReportOutcome navigation={navigation} route={route} />
      </View>
      <View key="3">
        <BattleReportDetail navigation={navigation} route={route} />
      </View>
      <View key="4">
        <BattleReportRounds navigation={navigation} route={route} />
      </View>
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
