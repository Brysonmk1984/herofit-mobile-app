import React from "react";
import { VStack, ScrollView } from "native-base";
import { MainStackProps } from "../../../common/types-navigator";
import { Header, ScreenContainer } from "../../../Components/CustomComponents";
import StatDisplay from "./StatDisplay";
import SpiralBackground from "../SpiralBackground";
import SwipeForNextScreen from "../SwipeForNextScreen";
import { Stat } from "../../../common/types";
import AttributeDetail from "../../../Components/Modals/AttributeDetail";

const BattleReportDetail: React.FC<MainStackProps<"BattleReportDetail"> & { setSelectedAttribute: (attribute: Lowercase<Stat>) => void; selectedAttribute: Lowercase<Stat> | null }> = ({ navigation, route, selectedAttribute, setSelectedAttribute }) => {
  const { battleReport } = route.params;

  return (
    <ScreenContainer screenName={route.name} bg={<SpiralBackground outcome={battleReport.outcome} />}>
      <ScrollView>
        <VStack>
          <Header text={"Battle Report"} extraPadding={false} mt={-7} mb={-4} />
          <StatDisplay battleReport={route.params.battleReport} setSelectedAttribute={setSelectedAttribute} />
        </VStack>
      </ScrollView>
      <SwipeForNextScreen center={true} />
      {selectedAttribute && <AttributeDetail id="AttributeDetail" attribute={selectedAttribute} />}
    </ScreenContainer>
  );
};
export default BattleReportDetail;
