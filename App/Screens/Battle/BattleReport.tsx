import React, { useContext, useEffect } from "react";
import { View } from "native-base";
import { MainDrawerProps } from "../../common/types-navigator";
import { ScreenContainer } from "../../Components/CustomComponents";
import { updateBattleReportSeen } from "../../api/battle";
import { GlobalStateContext } from "../../store";

const BattleReport: React.FC<MainDrawerProps<"BattleReport">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const BR = route.params.battleReport;

  useEffect(() => {
    updateBattleReportSeen({ id: BR.id });
    dispatch({ type: "SEEN BATTLE REPORT", payload: { latestBattle: { ...BR, seenReport: true } } });
  }, []);

  return <ScreenContainer screenName={route.name}></ScreenContainer>;
};

export default BattleReport;
