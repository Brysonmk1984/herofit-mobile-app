import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, useWindowDimensions } from "react-native";
import { View, Text, useTheme } from "native-base";
import { MainStackProps } from "../../../common/types-navigator";
import { ScreenContainer } from "../../../Components/CustomComponents";
import OutcomeSection from "./OutcomeSection";
import { BattleFoe, BattleOutcome } from "../../../common/types-battle";
import { Hero } from "../../../common/types";
import TopSection from "./TopSection";
import BottomSection from "./BottomSection";
import useModal from "../../../common/hooks/useModal";

const BattleReportOutcome: React.FC<MainStackProps<"BattleReportOutcome">> = ({ navigation, route }) => {
  const { height, width } = useWindowDimensions();
  const { avatar: hero, foe, outcome, roundBreakdown, ptGain, xpGain, itemsAcquired } = route.params.battleReport;
  const backgroundImage = require("../../../../assets/images/backgrounds/battle-report-background.webp");
  const { colors } = useTheme();
  const [top, setTop] = useState(null);
  const [bottom, setBottom] = useState(null);
  const [legacyBattle, setLegacyBattle] = useState(roundBreakdown.length ? false : true);
  const [pressedItem, setPressedItem] = useState(null);
  const { openModal } = useModal();

  function renderSpecialStatus() {
    const status = route.params.battleReport.aStatus;
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
          <TopSection height={height} {...specificProps(top, outcome, ptGain, xpGain, itemsAcquired)} />
          <BottomSection height={height} {...specificProps(bottom, outcome, ptGain, xpGain, itemsAcquired)} />
          <OutcomeSection height={height} top={top} bottom={bottom} outcome={outcome} endRound={legacyBattle ? null : roundBreakdown.length} legacyBattle={legacyBattle} />
        </>
      ) : null}
      <ImageBackground style={styles.backgroundImage} source={backgroundImage} resizeMode="stretch" opacity={0.6} />
    </ScreenContainer>
  );
};

export default BattleReportOutcome;

const styles = StyleSheet.create({ backgroundImage: { position: "absolute", width: "100%", height: "100%", zIndex: 0 } });
