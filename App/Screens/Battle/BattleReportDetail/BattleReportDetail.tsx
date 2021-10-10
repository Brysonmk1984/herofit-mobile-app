import React from "react";
import { View, Text } from "native-base";
import { MainDrawerProps } from "../../../common/types-navigator";
import { ScreenContainer } from "../../../Components/CustomComponents";

const BattleReportDetail: React.FC<MainDrawerProps<"BattleReportDetail">> = ({ navigation, route }) => {
  const { scenario, roundBreakdown, avatar, BRA, foe, BRF, foeType, effects, updatedAt, seasonalBonusElement } = route.params.battleReport;
  console.log(route.params.battleReport);

  return (
    <ScreenContainer screenName={route.name}>
      <Text>BRD</Text>
    </ScreenContainer>
  );
};
export default BattleReportDetail;
