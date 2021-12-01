import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { View, Text, Image, Box } from "native-base";
import PagerView from "react-native-pager-view";
import BattleReportOutcome from "./BattleReportOutcome/BattleReportOutcome";
import BattleReportDetail from "./BattleReportDetail/BattleReportDetail";
import BattleReportRounds from "./BattleReportRounds.tsx/BattleReportRounds";
import { updateBattleReportSeen } from "../../api/battle";
import { GlobalStateContext } from "../../store";
import useDidMount from "../../common/hooks/useDidMount";
import useModal from "../../common/hooks/useModal";
import AttributeDetail from "../../Components/Modals/AttributeDetail";

interface BattleReportProps {}

const BattleReport: React.FC<BattleReportProps> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { id } = route.params.battleReport;
  const [currentPage, setCurrentPage] = useState(1);
  const { mounted } = useDidMount();
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const { openModal } = useModal();

  function handleFinish(e) {
    setCurrentPage(e.nativeEvent.position);
  }

  function handleFirstAndLastSwipes(e) {
    if (currentPage === 4) {
      navigation.navigate("Home");
    } else if (currentPage === 0) {
      navigation.navigate("Home");
    }
  }

  useEffect(() => {
    if (selectedAttribute) {
      openModal("AttributeDetail");
    }
  }, [selectedAttribute]);

  // useEffect(() => {
  //   updateBattleReportSeen({ id });
  //   dispatch({ type: "SEEN BATTLE REPORT", payload: { latestBattle: { ...route.params.battleReport, seenReport: true } } });
  // }, []);

  return (
    <PagerView style={styles.pagerView} initialPage={currentPage} onPageSelected={e => handleFinish(e)} onPageScrollStateChanged={e => handleFirstAndLastSwipes(e)} overdrag={true}>
      <View key="1" bgColor="#000" alignItems="center">
        <Image size="80%" source={require("../../../assets/images/misc/hf-logo.webp")} alt="HeroFit Logo" resizeMode="contain" />
        <Text fontFamily="heading" fontSize="5xl" mt={-16} color="base.primaryAlt">
          - END -
        </Text>
      </View>

      <View key="2">
        <BattleReportOutcome navigation={navigation} route={route} />
      </View>
      <View key="3">{mounted && <BattleReportDetail navigation={navigation} route={route} selectedAttribute={selectedAttribute} setSelectedAttribute={setSelectedAttribute} />}</View>
      <View key="4">{mounted && <BattleReportRounds navigation={navigation} route={route} selectedAttribute={selectedAttribute} setSelectedAttribute={setSelectedAttribute} />}</View>
      <View key="5" bgColor="#000" alignItems="center">
        <Image size="80%" source={require("../../../assets/images/misc/hf-logo.webp")} alt="HeroFit Logo" resizeMode="contain" />
        <Text fontFamily="heading" fontSize="5xl" mt={-16} color="base.primaryAlt">
          - END -
        </Text>
      </View>
    </PagerView>
  );
};

export default BattleReport;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});
