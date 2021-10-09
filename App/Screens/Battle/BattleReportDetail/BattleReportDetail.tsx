import React from "react";
import { View } from "native-base";
import { MainDrawerProps } from "../../../common/types-navigator";
import { ScreenContainer } from "../../../Components/CustomComponents";

const BattleReportDetail: React.FC<MainDrawerProps<"BattleReportDetail">> = ({ navigation, route }) => {
  return <ScreenContainer screenName={route.name}></ScreenContainer>;
};
export default BattleReportDetail;
