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
import SwipeForNextScreen from "./SwipeForNextScreen";
import { capitalize } from "../../common/helperFunctions";

interface BattleReportProps {}

const BattleReport: React.FC<BattleReportProps> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { ptGain, xpGain, itemsAcquired } = route.params.battleReport;
  const [currentPage, setCurrentPage] = useState(0);
  const { mounted } = useDidMount();
  const [loadRemainder, setLoadRemainder] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const { openModal } = useModal();

  function handleFinish(e) {
    setCurrentPage(e.nativeEvent.position);
  }

  function handleLastSwipe(e) {
    if (currentPage === 4) {
      // Rewards are now displayed on the homescreen after the battle
      const itemsGainedFromBattle = itemsAcquired
        ? itemsAcquired.map(item => {
            return `Earned the ${capitalize(item.name)} ${item.type === "skin" ? "Costume" : item.type}`;
          })
        : [];

      const ptXpAquired = [];
      if (xpGain > 0) {
        ptXpAquired.push(`Gained ${xpGain} XP`);
      }
      if (ptGain > 0) {
        ptXpAquired.push(`Gained ${ptGain} Photon Tokens`);
      }
      const postBattleReportAwards = [...itemsGainedFromBattle, ...ptXpAquired];
      navigation.navigate("Home", { postBattleReportAwards });
    }
  }

  useEffect(() => {
    if (selectedAttribute) {
      openModal("AttributeDetail");
    }
  }, [selectedAttribute]);

  useEffect(() => {
    updateBattleReportSeen({ id });
    dispatch({ type: "SEEN BATTLE REPORT", payload: { latestBattle: { ...route.params.battleReport, seenReport: true } } });
  }, []);

  useEffect(() => {
    if (mounted) {
      setLoadRemainder(true);
    }
  }, [mounted]);

  return (
    <PagerView style={styles.pagerView} initialPage={currentPage} onPageSelected={e => handleFinish(e)} onPageScrollStateChanged={e => handleLastSwipe(e)} overdrag={true}>
      <View key="1" bgColor="#000" alignItems="center">
        <Image size="80%" source={require("../../../assets/images/misc/hf-logo.webp")} alt="HeroFit Logo" resizeMode="contain" />
        <Text fontFamily="heading" fontSize="5xl" mt={-20} color="base.brand">
          Battle Report
        </Text>
        <SwipeForNextScreen reversedText={true} />
      </View>

      <View key="2">{mounted && <BattleReportOutcome navigation={navigation} route={route} />}</View>
      <View key="3">{loadRemainder && <BattleReportDetail navigation={navigation} route={route} selectedAttribute={selectedAttribute} setSelectedAttribute={setSelectedAttribute} />}</View>
      <View key="4">{loadRemainder && <BattleReportRounds navigation={navigation} route={route} selectedAttribute={selectedAttribute} setSelectedAttribute={setSelectedAttribute} />}</View>
      <View key="5" bgColor="#000" alignItems="center">
        {loadRemainder && (
          <>
            <Image size="80%" source={require("../../../assets/images/misc/hf-logo.webp")} alt="HeroFit Logo" resizeMode="contain" />
            <Text fontFamily="heading" fontSize="5xl" mt={-16} color="base.primaryAlt">
              - END -
            </Text>
          </>
        )}
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
