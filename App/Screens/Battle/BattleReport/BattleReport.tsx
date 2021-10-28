import React, { useContext, useEffect, useState } from "react";
import { ImageBackground, StyleSheet, useWindowDimensions } from "react-native";
import { View, Text, useTheme } from "native-base";
import { MainDrawerProps } from "../../../common/types-navigator";
import { ScreenContainer } from "../../../Components/CustomComponents";
import { updateBattleReportSeen } from "../../../api/battle";
import { GlobalStateContext } from "../../../store";
import OutcomeSection from "./OutcomeSection";
import { BattleDetailOnly, BattleFoe, BattleOutcome } from "../../../common/types-battle";
import { Hero } from "../../../common/types";
import TopSection from "./TopSection";
import BottomSection from "./BottomSection";
import ItemDetail from "../../Home/Components/BottomDrawer/HiddenInventory/Modals/ItemDetail";
import useModal from "../../../common/hooks/useModal";

const BattleReport: React.FC<MainDrawerProps<"BattleReport">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { height, width } = useWindowDimensions();
  const { id, avatar: hero, aStatus, foe, outcome, roundBreakdown, ptGain, xpGain, itemsAcquired } = route.params.battleReport;
  const backgroundImage = require("../../../../assets/images/backgrounds/battle-report-background.webp");
  const { colors } = useTheme();
  const [top, setTop] = useState(null);
  const [bottom, setBottom] = useState(null);
  const [legacyBattle, setLegacyBattle] = useState(roundBreakdown.length ? false : true);
  const [pressedItem, setPressedItem] = useState(null);
  const { openModal } = useModal();

  function renderSpecialStatus() {
    const status = battleReport.aStatus;
    if (status !== "Knocked Out" || status !== "Recovering") {
      if (status === "Infected") {
        // Hard Coded 24hrs... too difficult to get actual value
        return (
          <span className="post-battle-status">
            Status:&nbsp;&nbsp;<strong>{status} - 24 hrs</strong>
          </span>
        );
      }
      return null;
    }
    return null;
  }

  function specificProps(heroOrFoe: Hero | BattleFoe, outcome: BattleOutcome, ptGain: number, xpGain: number, itemsAcquired: Item[], aStatus: HeroStatus) {
    function isHero(heroOrFoe: Hero | BattleFoe): heroOrFoe is Hero {
      return heroOrFoe.hasOwnProperty("id");
    }
    const contender = isHero(heroOrFoe) ? "hero" : "foe";

    if (contender === "hero") {
      return {
        outcome,
        contender: heroOrFoe,
        contenderType: "hero" as const,
        ptGain,
        xpGain,
        itemsAcquired,
      };
    } else {
      return {
        contender: heroOrFoe,
        contenderType: "foe" as const,
        character: hero.character,
      };
    }
  }

  function handleNavigateToDetails(br: BattleDetailOnly) {
    const battleReport = (({ outcome, scenario, roundBreakdown, avatar, bra, foe, brf, foeType, effects, updatedAt, seasonalBonusElement, effectProcs }): BattleDetailOnly => ({ outcome, scenario, roundBreakdown, avatar, bra, foe, brf, foeType, effects, updatedAt, seasonalBonusElement, effectProcs }))(br);

    navigation.push("App", { screen: "BattleReportDetail", params: { battleReport, push: navigation.push("App") } });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleNavigateToDetails(route.params.battleReport);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    updateBattleReportSeen({ id });
    dispatch({ type: "SEEN BATTLE REPORT", payload: { latestBattle: { ...route.params.battleReport, seenReport: true } } });
  }, []);

  useEffect(() => {
    if (outcome === "Avatar Wins") {
      setTop(hero);
      setBottom(foe);
    } else if (outcome === "Foe Wins") {
      setTop(foe);
      setBottom(hero);
    } else if (outcome === "Double KO") {
      setTop(hero);
      setBottom(foe);
    } else {
      setTop(hero);
      setBottom(foe);
    }
  }, []);

  useEffect(() => {
    if (pressedItem) {
      openModal("BattleReportItemDetail");
    }
  }, [pressedItem]);

  return (
    <ScreenContainer screenName={route.name} bgColor={outcome === "Avatar Wins" ? colors.base.highlight : colors.base.lowlight}>
      {top && bottom ? (
        <>
          <TopSection height={height} {...specificProps(top, outcome, ptGain, xpGain, itemsAcquired)} setPressedItem={setPressedItem} />
          <BottomSection height={height} {...specificProps(bottom, outcome, ptGain, xpGain, itemsAcquired)} setPressedItem={setPressedItem} />
          <OutcomeSection height={height} push={() => handleNavigateToDetails(route.params.battleReport)} top={top} bottom={bottom} outcome={outcome} endRound={legacyBattle ? null : roundBreakdown.length} legacyBattle={legacyBattle} />
        </>
      ) : null}
      <ImageBackground style={styles.backgroundImage} source={backgroundImage} resizeMode="stretch" opacity={0.6} />
      {pressedItem && <ItemDetail id="BattleReportItemDetail" item={pressedItem} character={hero.character} buttonText="OK" modalAction={() => setPressedItem(null)} />}
    </ScreenContainer>
  );
};

export default BattleReport;

const styles = StyleSheet.create({ backgroundImage: { position: "absolute", width: "100%", height: "100%", zIndex: 0 } });
