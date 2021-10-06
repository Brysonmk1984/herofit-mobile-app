import React from "react";
import { View } from "native-base";
import { MainDrawerProps } from "../../common/types-navigator";
import { ScreenContainer } from "../../Components/CustomComponents";

const BattleReport: React.FC<MainDrawerProps<"BattleReport">> = ({ navigation, route }) => {
  return <ScreenContainer screenName={route.name}></ScreenContainer>;
};

export default BattleReport;
