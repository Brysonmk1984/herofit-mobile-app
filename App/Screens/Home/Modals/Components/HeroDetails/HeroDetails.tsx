import React from "react";
import { View, Text } from "native-base";
import { thousandsFormat } from "../../../../../common/helperFunctions";
import { CountdownTimer } from "./CountdownTimer";
import { CountUp } from "use-count-up";

interface HeroDetailsProps {
  name: string;
  status: string;
  photonTokens: number;
  goToBattle: boolean;
  level: number;
  activityXP: number;
  battleXP: number;
  title?: string;
}

export const HeroDetails: React.FC<HeroDetailsProps> = ({ name, status, photonTokens, goToBattle, level, activityXP, battleXP, title }) => {
  return (
    <View>
      {title && <Text>{title}</Text>}
      <Text>{name}</Text>
      <Text>
        Level: {level}
        <Text>
          XP:
          <CountUp isCounting end={activityXP + battleXP} thousandsSeparator="," duration={6} />
        </Text>
      </Text>
      <Text>Status: {status}</Text>
      {status === "Knocked Out" ? <CountdownTimer type={"Knocked Out"} /> : goToBattle ? <CountdownTimer type={"Battle"} /> : null}
      <Text>Photon Tokens: {thousandsFormat(photonTokens)}</Text>
    </View>
  );
};
